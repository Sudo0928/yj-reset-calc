import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  DEFAULT_STATS, DEFAULT_ENV, DEFAULT_ASSUMPTIONS,
  type StatsFlat, type EnvInput, type AssumptionsInput,
} from '@/data/statsSchema';

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
}

export const useStatsStore = create<StatsState>()(
  persist(
    (set) => ({
      stats: DEFAULT_STATS,
      env: DEFAULT_ENV,
      assumptions: DEFAULT_ASSUMPTIONS,

      setStat: (key, value) =>
        set((s) => ({ stats: { ...s.stats, [key]: value } })),

      setEnv: (key, value) =>
        set((s) => ({ env: { ...s.env, [key]: value } })),

      setAssumption: (key, value) =>
        set((s) => ({ assumptions: { ...s.assumptions, [key]: value } })),

      loadStats: (stats) => set({ stats: { ...DEFAULT_STATS, ...stats } }),
      loadEnv: (env) => set((s) => ({ env: { ...s.env, ...env } })),
      loadAssumptions: (a) => set((s) => ({ assumptions: { ...s.assumptions, ...a } })),
      resetAssumptions: () => set({ assumptions: DEFAULT_ASSUMPTIONS }),

      reset: () => set({ stats: DEFAULT_STATS, env: DEFAULT_ENV, assumptions: DEFAULT_ASSUMPTIONS }),
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
