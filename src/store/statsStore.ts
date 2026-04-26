import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_STATS, DEFAULT_ENV, type StatsFlat, type EnvInput } from '@/data/statsSchema';

interface StatsState {
  stats: StatsFlat;
  env: EnvInput;
  setStat: (key: string, value: number) => void;
  setEnv: <K extends keyof EnvInput>(key: K, value: EnvInput[K]) => void;
  loadStats: (stats: StatsFlat) => void;
  loadEnv: (env: Partial<EnvInput>) => void;
  reset: () => void;
}

export const useStatsStore = create<StatsState>()(
  persist(
    (set) => ({
      stats: DEFAULT_STATS,
      env: DEFAULT_ENV,

      setStat: (key, value) =>
        set((s) => ({ stats: { ...s.stats, [key]: value } })),

      setEnv: (key, value) =>
        set((s) => ({ env: { ...s.env, [key]: value } })),

      loadStats: (stats) => set({ stats: { ...DEFAULT_STATS, ...stats } }),
      loadEnv: (env) => set((s) => ({ env: { ...s.env, ...env } })),

      reset: () => set({ stats: DEFAULT_STATS, env: DEFAULT_ENV }),
    }),
    {
      name: 'yjreset:stats',
      version: 1,
    },
  ),
);
