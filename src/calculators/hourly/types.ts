import type { StatsFlat, EnvInput } from '@/data/statsSchema';

export type GoldMode = 'measured' | 'dps';

export interface HourlyInput {
  stats: StatsFlat;
  env: EnvInput;
  mode: GoldMode;
  hoursPerDay: number; // 1일 사냥 시간 (24 = 풀방치)
}

export interface HourlyResult {
  // 골드
  goldPerMin: number;
  goldPerHour: number;
  goldPerDay: number;
  goldPerWeek: number;
  goldPer30Day: number;
  goldMode: GoldMode;
  goldNote: string; // 모드별 산출 근거

  // 빛의파편
  shardPerSynthesis: number; // 슬라임 합성 1회당 (n² × 배율)
  shardMultiplier: number;
  shardPerHour: number;       // 슬라임 농장 가정 (분당 합성수 × 60)
  shardPerDay: number;
  shardPerWeek: number;

  // 연구 회전
  researchHoursPer1h: number; // 연구 시간 감소% 반영해 1시간이 실제 몇 시간 가치인지
  researchTimeRedPct: number;

  // 방치 보상
  idleRewardMultiplier: number; // (방치보상시간% / 100)
  idleRewardHoursValue: number; // 24시간 방치 시 실효 시간

  // 누적 시뮬 (시간 인덱스, 골드 누적, 파편 누적)
  cumulative: Array<{ hour: number; gold: number; shard: number }>;
}
