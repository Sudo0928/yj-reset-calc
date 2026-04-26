import { describe, it, expect } from 'vitest';
import { calcInstantOpen, calcBernoulli } from './formula';
import { DEFAULT_INSTANT_INPUT, DEFAULT_BERNOULLI_INPUT } from './types';

describe('calcInstantOpen — 즉시 개봉 가성비', () => {
  it('전설상자 자연 해제 시간 = 720분', () => {
    const result = calcInstantOpen({ ...DEFAULT_INSTANT_INPUT, chestId: 'legend', hasPremium: false });
    expect(result.effectiveOpenMinutes).toBe(720);
  });

  it('광제 보유시 30분 단축', () => {
    const result = calcInstantOpen({ ...DEFAULT_INSTANT_INPUT, chestId: 'legend', hasPremium: true });
    expect(result.effectiveOpenMinutes).toBe(720 - 30);
  });

  it('일반상자 광제 시 5분 - 30분 = 0분 (음수 방지)', () => {
    const result = calcInstantOpen({ ...DEFAULT_INSTANT_INPUT, chestId: 'normal', hasPremium: true });
    expect(result.effectiveOpenMinutes).toBe(0);
  });

  it('즉시 다이아 ≤ 시간 가치이면 instantWorthIt=true', () => {
    // 전설 720분 × 2다이아 = 1440다이아 > 150다이아 → 이득
    const result = calcInstantOpen({
      ...DEFAULT_INSTANT_INPUT, chestId: 'legend', instantDiamond: 150, timeValuePerMin: 2,
    });
    expect(result.instantWorthIt).toBe(true);
  });
});

describe('calcBernoulli — 이항분포 + 몬테카를로', () => {
  it('p=5%, n=100 → P(X≥1) ≈ 1 - 0.95^100 ≈ 99.4%', () => {
    const result = calcBernoulli({ ...DEFAULT_BERNOULLI_INPUT, chestCount: 100, targetProbability: 5 });
    expect(result.probAtLeastOne).toBeCloseTo(1 - Math.pow(0.95, 100), 4);
  });

  it('기댓값 E[X] = n·p', () => {
    const result = calcBernoulli({ ...DEFAULT_BERNOULLI_INPUT, chestCount: 100, targetProbability: 5 });
    expect(result.expectedDrops).toBeCloseTo(5);
  });

  it('표준편차 σ = √(n·p·(1-p))', () => {
    const result = calcBernoulli({ ...DEFAULT_BERNOULLI_INPUT, chestCount: 100, targetProbability: 5 });
    expect(result.stdDev).toBeCloseTo(Math.sqrt(100 * 0.05 * 0.95));
  });

  it('p=0이면 P(X≥1) = 0', () => {
    const result = calcBernoulli({ ...DEFAULT_BERNOULLI_INPUT, chestCount: 100, targetProbability: 0 });
    expect(result.probAtLeastOne).toBe(0);
    expect(result.expectedDrops).toBe(0);
  });

  it('n=0이면 모든 결과 0', () => {
    const result = calcBernoulli({ ...DEFAULT_BERNOULLI_INPUT, chestCount: 0, targetProbability: 50 });
    expect(result.probAtLeastOne).toBe(0);
    expect(result.expectedDrops).toBe(0);
  });

  it('몬테카를로 시뮬: 시드 고정 → 같은 seed=42로 재현 가능', () => {
    const r1 = calcBernoulli({ ...DEFAULT_BERNOULLI_INPUT, chestCount: 100, targetProbability: 5, trials: 5000 });
    const r2 = calcBernoulli({ ...DEFAULT_BERNOULLI_INPUT, chestCount: 100, targetProbability: 5, trials: 5000 });
    expect(r1.monteCarlo.mean).toBe(r2.monteCarlo.mean);
    expect(r1.monteCarlo.p1).toBe(r2.monteCarlo.p1);
  });

  it('몬테카를로 평균이 이론 기댓값과 가까움 (오차 ±10%)', () => {
    const result = calcBernoulli({ ...DEFAULT_BERNOULLI_INPUT, chestCount: 100, targetProbability: 5, trials: 10000 });
    expect(Math.abs(result.monteCarlo.mean - result.expectedDrops)).toBeLessThan(0.5);
  });
});
