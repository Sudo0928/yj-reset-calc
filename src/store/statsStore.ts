import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  DEFAULT_STATS, DEFAULT_ENV, DEFAULT_ASSUMPTIONS,
  type StatsFlat, type EnvInput, type AssumptionsInput,
} from '@/data/statsSchema';
import { fetchCalcStateFromCloud, pushCalcState } from '@/lib/firebase/sync';
import { useAuthStore } from './authStore';

const CALC_ID = 'stats';
const PUSH_DEBOUNCE_MS = 1500;

let _pushTimer: ReturnType<typeof setTimeout> | null = null;
function schedulePush(payload: Record<string, unknown>) {
  const uid = useAuthStore.getState().user?.uid;
  if (!uid) return;
  if (_pushTimer) clearTimeout(_pushTimer);
  _pushTimer = setTimeout(() => { void pushCalcState(uid, CALC_ID, payload); }, PUSH_DEBOUNCE_MS);
}

interface StatsState {
  stats: StatsFlat;
  env: EnvInput;
  assumptions: AssumptionsInput;
  setStat: (key: string, value: number) => void;
  setEnv: <K extends keyof EnvInput>(key: K, value: EnvInput[K]) => void;
  setAssumption: <K extends keyof AssumptionsInput>(key: K, value: AssumptionsInput[K]) => void;
  loadStats: (stats: StatsFlat) => void;
  loadEnv: (env: Partial<EnvInput>) => void;
  loadAssumptions: (a: Partial<AssumptionsInput>) => void;
  resetAssumptions: () => void;
  reset: () => void;
  syncFromCloud: (uid: string) => Promise<void>;
}

export const useStatsStore = create<StatsState>()(
  persist(
    (set, get) => ({
      stats: DEFAULT_STATS,
      env: DEFAULT_ENV,
      assumptions: DEFAULT_ASSUMPTIONS,

      setStat: (key, value) => {
        set((s) => ({ stats: { ...s.stats, [key]: value } }));
        schedulePush({ stats: get().stats, env: get().env, assumptions: get().assumptions });
      },

      setEnv: (key, value) => {
        set((s) => ({ env: { ...s.env, [key]: value } }));
        schedulePush({ stats: get().stats, env: get().env, assumptions: get().assumptions });
      },

      setAssumption: (key, value) => {
        set((s) => ({ assumptions: { ...s.assumptions, [key]: value } }));
        schedulePush({ stats: get().stats, env: get().env, assumptions: get().assumptions });
      },

      loadStats: (stats) => {
        set({ stats: { ...DEFAULT_STATS, ...stats } });
        schedulePush({ stats: get().stats, env: get().env, assumptions: get().assumptions });
      },
      loadEnv: (env) => {
        set((s) => ({ env: { ...s.env, ...env } }));
        schedulePush({ stats: get().stats, env: get().env, assumptions: get().assumptions });
      },
      loadAssumptions: (a) => {
        set((s) => ({ assumptions: { ...s.assumptions, ...a } }));
        schedulePush({ stats: get().stats, env: get().env, assumptions: get().assumptions });
      },
      resetAssumptions: () => {
        set({ assumptions: DEFAULT_ASSUMPTIONS });
        schedulePush({ stats: get().stats, env: get().env, assumptions: get().assumptions });
      },

      reset: () => {
        set({ stats: DEFAULT_STATS, env: DEFAULT_ENV, assumptions: DEFAULT_ASSUMPTIONS });
        schedulePush({ stats: DEFAULT_STATS, env: DEFAULT_ENV, assumptions: DEFAULT_ASSUMPTIONS });
      },

      syncFromCloud: async (uid) => {
        const cloud = await fetchCalcStateFromCloud(uid, CALC_ID);
        if (!cloud) {
          // 클라우드에 없으면 현재 로컬 값을 클라우드에 푸시
          void pushCalcState(uid, CALC_ID, {
            stats: get().stats, env: get().env, assumptions: get().assumptions,
          });
          return;
        }
        // 클라우드에 있으면 로컬에 머지 (클라우드 우선 — 다른 기기 변경 반영)
        const cs = cloud as { stats?: StatsFlat; env?: EnvInput; assumptions?: AssumptionsInput };
        set({
          stats: { ...DEFAULT_STATS, ...(cs.stats ?? {}) },
          env: { ...DEFAULT_ENV, ...(cs.env ?? {}) },
          assumptions: { ...DEFAULT_ASSUMPTIONS, ...(cs.assumptions ?? {}) },
        });
      },
    }),
    {
      name: 'yjreset:stats',
      version: 2, // v1 → v2: assumptions 추가
      migrate: (persisted, version) => {
        const p = (persisted as Partial<StatsState>) ?? {};
        if (version < 2) {
          p.assumptions = DEFAULT_ASSUMPTIONS;
        }
        return p as StatsState;
      },
    },
  ),
);
