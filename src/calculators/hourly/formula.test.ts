import { describe, it, expect } from 'vitest';
import { calcHourly } from './formula';
import { DEFAULT_STATS, DEFAULT_ENV } from '@/data/statsSchema';

describe('calcHourly — 시간당 자원 시뮬', () => {
  it('측정값 모드: 분당 200K 골드 → 일일 200K × 1440 = 288M', () => {
    const r = calcHourly({
      stats: DEFAULT_STATS,
      env: { ...DEFAULT_ENV, measuredGoldPerMin: 200_000 },
      mode: 'measured',
      hoursPerDay: 24,
    });
    expect(r.goldPerMin).toBe(200_000);
    expect(r.goldPerHour).toBe(200_000 * 60);
    expect(r.goldPerDay).toBe(200_000 * 60 * 24);
    expect(r.goldPerWeek).toBe(200_000 * 60 * 24 * 7);
  });

  it('측정값 모드는 골획%/전골획% 보정 안함 (이미 반영된 측정값)', () => {
    const r1 = calcHourly({
      stats: { ...DEFAULT_STATS, goldAcq: 100, totalGoldAcq: 100 },
      env: { ...DEFAULT_ENV, measuredGoldPerMin: 100_000 },
      mode: 'measured',
      hoursPerDay: 24,
    });
    const r2 = calcHourly({
      stats: { ...DEFAULT_STATS, goldAcq: 200, totalGoldAcq: 150 },
      env: { ...DEFAULT_ENV, measuredGoldPerMin: 100_000 },
      mode: 'measured',
      hoursPerDay: 24,
    });
    expect(r1.goldPerMin).toBe(r2.goldPerMin); // 측정값 그대로
  });

  it('DPS 모드: 처치수 100 × 몹당 100 × 골획%×전골획% 적용', () => {
    const r = calcHourly({
      stats: { ...DEFAULT_STATS, goldAcq: 200, totalGoldAcq: 150 },
      env: { ...DEFAULT_ENV, killsPerMin: 100, goldPerKill: 100 },
      mode: 'dps',
      hoursPerDay: 24,
    });
    // 100 × 100 × 2.0 × 1.5 = 30,000
    expect(r.goldPerMin).toBeCloseTo(30_000);
  });

  it('빛파편: 슬마팩 + 효과 빛파편+50% 모두 적용', () => {
    const r = calcHourly({
      stats: { ...DEFAULT_STATS, lightShardAcq: 50 },
      env: { ...DEFAULT_ENV, slimeAvgLevel: 10, slimeMasterPack: true, hasResearchBonus: false },
      mode: 'measured',
      hoursPerDay: 24,
    });
    // 슬마팩 ×2 × (1 + 50/100) = 3.0
    expect(r.shardMultiplier).toBeCloseTo(3.0);
    // 10² × 3.0 = 300 / 합성
    expect(r.shardPerSynthesis).toBeCloseTo(300);
  });

  it('연구 시간 감소 50%면 1시간이 2시간 가치', () => {
    const r = calcHourly({
      stats: { ...DEFAULT_STATS, researchTimeRed: 50 },
      env: DEFAULT_ENV,
      mode: 'measured',
      hoursPerDay: 24,
    });
    expect(r.researchHoursPer1h).toBeCloseTo(2);
  });

  it('방치 보상 시간 150%면 24h × 1.5 = 36h 가치', () => {
    const r = calcHourly({
      stats: { ...DEFAULT_STATS, idleRewardTime: 150 },
      env: DEFAULT_ENV,
      mode: 'measured',
      hoursPerDay: 24,
    });
    expect(r.idleRewardMultiplier).toBeCloseTo(1.5);
    expect(r.idleRewardHoursValue).toBeCloseTo(36);
  });

  it('1일 12시간 사냥 시 일일 골드 절반', () => {
    const r12 = calcHourly({
      stats: DEFAULT_STATS,
      env: { ...DEFAULT_ENV, measuredGoldPerMin: 100_000 },
      mode: 'measured',
      hoursPerDay: 12,
    });
    const r24 = calcHourly({
      stats: DEFAULT_STATS,
      env: { ...DEFAULT_ENV, measuredGoldPerMin: 100_000 },
      mode: 'measured',
      hoursPerDay: 24,
    });
    expect(r12.goldPerDay).toBeCloseTo(r24.goldPerDay / 2);
  });
});
