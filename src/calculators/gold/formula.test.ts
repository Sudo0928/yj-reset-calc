import { describe, it, expect } from 'vitest';
import { calcGold, calcLightShard } from './formula';
import { DEFAULT_GOLD_INPUT, DEFAULT_LIGHT_SHARD_INPUT } from './types';

describe('calcGold — 골드 효율 비교', () => {
  it('현재=목표면 변화율 0%', () => {
    const result = calcGold({
      ...DEFAULT_GOLD_INPUT,
      currentGoldPerMin: 100_000,
      goldAcqBonus: 200,
      totalGoldBonus: 150,
      targetGoldAcqBonus: 200,
      targetTotalGoldBonus: 150,
    });
    expect(result.deltaPercent).toBeCloseTo(0);
    expect(result.changeRatio).toBeCloseTo(1);
  });

  it('골획 200% → 230% 시 (×1.5 → ×1.5) 비율 (2.3/2.0)', () => {
    const result = calcGold({
      ...DEFAULT_GOLD_INPUT,
      currentGoldPerMin: 100_000,
      goldAcqBonus: 200,
      totalGoldBonus: 100,
      targetGoldAcqBonus: 230,
      targetTotalGoldBonus: 100,
    });
    expect(result.changeRatio).toBeCloseTo(2.3 / 2.0);
    expect(result.deltaPercent).toBeCloseTo(15); // 신화벞 이론 +15%
  });

  it('1일 24시간 → 분당 × 1440', () => {
    const result = calcGold({
      ...DEFAULT_GOLD_INPUT,
      currentGoldPerMin: 100,
      hoursPerDay: 24,
    });
    expect(result.currentPerDay).toBeCloseTo(100 * 1440);
  });
});

describe('calcLightShard — 빛의파편 + 달빛 충전', () => {
  it('합성 1회당 파편 = 슬라임 레벨²', () => {
    const result = calcLightShard({ ...DEFAULT_LIGHT_SHARD_INPUT, avgSlimeLevel: 10, days: 0, dailyFreeMoonlight: 0 });
    expect(result.shardPerSynthesis).toBe(100);
  });

  it('슬라임 마스터 팩 ×2 배율 적용', () => {
    const r1 = calcLightShard({ ...DEFAULT_LIGHT_SHARD_INPUT, avgSlimeLevel: 10, hasMasterPack: false, days: 0, dailyFreeMoonlight: 0 });
    const r2 = calcLightShard({ ...DEFAULT_LIGHT_SHARD_INPUT, avgSlimeLevel: 10, hasMasterPack: true, days: 0, dailyFreeMoonlight: 0 });
    expect(r2.shardPerSynthesis).toBeCloseTo(r1.shardPerSynthesis * 2);
  });

  it('소환→합성 변환: 100회 → 97회 (이진수 1 개수)', () => {
    // 100 = 1100100 (이진수) → 1의 개수 3개 → 100 - 3 = 97
    const result = calcLightShard({ ...DEFAULT_LIGHT_SHARD_INPUT, days: 1, dailyFreeMoonlight: 100, moonlightCharges: 0, newMemberRate: 0 });
    expect(result.totalSynth).toBe(97);
  });

  it('1000회 소환 → 994회 합성', () => {
    // 1000 = 1111101000 → 1의 개수 6개 → 1000 - 6 = 994
    const result = calcLightShard({ ...DEFAULT_LIGHT_SHARD_INPUT, days: 1, dailyFreeMoonlight: 1000, moonlightCharges: 0, newMemberRate: 0 });
    expect(result.totalSynth).toBe(994);
  });

  it('새식구 50%면 합성 횟수 ×2 배', () => {
    const r1 = calcLightShard({ ...DEFAULT_LIGHT_SHARD_INPUT, days: 1, dailyFreeMoonlight: 100, newMemberRate: 0 });
    const r2 = calcLightShard({ ...DEFAULT_LIGHT_SHARD_INPUT, days: 1, dailyFreeMoonlight: 100, newMemberRate: 50 });
    expect(r2.totalSynth).toBeCloseTo(r1.totalSynth * 2, 0);
  });

  it('달빛 충전 0회면 ROI 0', () => {
    const result = calcLightShard({ ...DEFAULT_LIGHT_SHARD_INPUT, moonlightCharges: 0 });
    expect(result.roi).toBe(0);
    expect(result.diamondInvested).toBe(0);
  });
});
