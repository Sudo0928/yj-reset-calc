import { describe, it, expect } from 'vitest';
import { calcCompare } from './formula';
import { DEFAULT_STATS, DEFAULT_ENV, type StatsFlat } from '@/data/statsSchema';

const baseLeft = { stats: { ...DEFAULT_STATS, attack: 100_000, attackSpeed: 100, normalMonsterDmg: 110, allDmgInc: 101, critDmg: 50 } as StatsFlat, env: { ...DEFAULT_ENV, measuredGoldPerMin: 100_000 } };

describe('calcCompare — 빌드 비교', () => {
  it('좌=우면 모든 차이 0', () => {
    const r = calcCompare({ left: baseLeft, right: baseLeft, hoursPerDay: 24 });
    expect(r.dpsDiff).toBe(0);
    expect(r.goldHrDiff).toBe(0);
    expect(r.hpDiff).toBe(0);
  });

  it('우 공격력 2배 → DPS 2배 + 시간당 골드 동일 (측정값 모드)', () => {
    const right = { ...baseLeft, stats: { ...baseLeft.stats, attack: 200_000 } };
    const r = calcCompare({ left: baseLeft, right, hoursPerDay: 24 });
    expect(r.rightDps.total).toBeCloseTo(baseLeft.stats.attack! * 2 * 1.11);
    expect(r.dpsDiffPct).toBeCloseTo(100);
    // 측정값 모드는 골획%/전골획%만 보지 않으므로 동일
    expect(r.goldHrDiffPct).toBe(0);
  });

  it('효과 카테고리 차이 정상 노출', () => {
    const right = { ...baseLeft, stats: { ...baseLeft.stats, goldAcq: 130 } };
    const r = calcCompare({ left: baseLeft, right, hoursPerDay: 24 });
    const goldEffect = r.effectDiffs.find((e) => e.key === 'goldAcq')!;
    expect(goldEffect.diff).toBe(30);
    expect(goldEffect.left).toBe(100);
    expect(goldEffect.right).toBe(130);
  });

  it('민감도 top 5: 공격력 +1% 시 DPS +1% 변화 (선형)', () => {
    const r = calcCompare({ left: baseLeft, right: baseLeft, hoursPerDay: 24 });
    const atkSens = r.sensitivityTop5.find((s) => s.key === 'attack');
    expect(atkSens).toBeDefined();
    expect(atkSens!.dpsDeltaPct).toBeCloseTo(1, 1);
  });

  it('생존력: 우측 HP만 증가 시 차이 정상', () => {
    const left = { ...baseLeft, stats: { ...baseLeft.stats, hp: 100_000, totalHpInc: 0 } };
    const right = { ...baseLeft, stats: { ...baseLeft.stats, hp: 100_000, totalHpInc: 50 } };
    const r = calcCompare({ left, right, hoursPerDay: 24 });
    expect(r.hpDiff).toBeCloseTo(50_000); // 150K - 100K
    expect(r.hpDiffPct).toBeCloseTo(50);
  });
});
