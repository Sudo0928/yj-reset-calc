import type { StatsFlat, EnvInput } from '@/data/statsSchema';
import type { BuildSnapshot } from '@/lib/storage/buildShareUrl';
import type { DpsBreakdown } from '@/calculators/dps/formula';

export type { BuildSnapshot };

export interface CompareInput {
  left: BuildSnapshot;
  right: BuildSnapshot;
  hoursPerDay: number;
}

export interface SensitivityItem {
  key: keyof StatsFlat | string;
  label: string;
  dpsDeltaPct: number;
  goldDeltaPct: number;
}

export interface CompareResult {
  // DPS
  leftDps: DpsBreakdown;
  rightDps: DpsBreakdown;
  dpsDiff: number;        // right - left
  dpsDiffPct: number;

  // 시간당 골드 (DPS 모드 사용)
  leftGoldHr: number;
  rightGoldHr: number;
  goldHrDiff: number;
  goldHrDiffPct: number;

  // 생존력
  leftHp: number;
  rightHp: number;
  hpDiff: number;
  hpDiffPct: number;

  // 효과 카테고리별 차이
  effectDiffs: Array<{ key: string; label: string; left: number; right: number; diff: number }>;

  // 민감도 top 5 (좌 빌드 기준 +1% 시 DPS·시간당골드 변화)
  sensitivityTop5: SensitivityItem[];
}

export type { EnvInput };
