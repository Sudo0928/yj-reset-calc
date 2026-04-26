import { describe, it, expect } from 'vitest';
import { calcDps, calcSurvival } from './formula';
import { DEFAULT_STATS, DEFAULT_ENV, type StatsFlat } from '@/data/statsSchema';

const baseStats: StatsFlat = {
  ...DEFAULT_STATS,
  attack: 100_000,
  attackSpeed: 1,
  normalAttackDmg: 100,
  skillDmg: 100,
  normalMonsterDmg: 110,
  bossMonsterDmg: 150,
  allDmgInc: 101,
  critRate: 0,
  critDmg: 50,
};

describe('calcDps — 여고생/드론/동료 DPS 분해', () => {
  it('드론·동료 미입력 시 girl만 active', () => {
    const r = calcDps(baseStats, DEFAULT_ENV);
    expect(r.drone).toBe(0);
    expect(r.companion).toBe(0);
    expect(r.girl).toBeGreaterThan(0);
    expect(r.total).toBe(r.girl);
    expect(r.girlPct).toBeCloseTo(100);
  });

  it('치명 0%면 기대 배수 = 1', () => {
    const r = calcDps({ ...baseStats, critRate: 0 }, DEFAULT_ENV);
    // 100K × 1.11 (평균 mult) × 1.0 × 1 = 111K
    expect(r.girl).toBeCloseTo(100_000 * 1.11);
  });

  it('치명 100%면 기대 배수 = 1.5+0.5 = 2.0', () => {
    const r = calcDps({ ...baseStats, critRate: 100, critDmg: 50 }, DEFAULT_ENV);
    expect(r.girl).toBeCloseTo(100_000 * 1.11 * 2.0);
  });

  it('보스 토글 시 보스 피해량 사용', () => {
    const normal = calcDps(baseStats, { ...DEFAULT_ENV, isBoss: false });
    const boss = calcDps(baseStats, { ...DEFAULT_ENV, isBoss: true });
    expect(boss.girl).toBeGreaterThan(normal.girl);
  });

  it('드론 활성화 시 drone 비중 > 0', () => {
    const stats: StatsFlat = {
      ...baseStats,
      droneAttack: 50_000,
      droneNormalMonDmg: 200,
    };
    const r = calcDps(stats, DEFAULT_ENV);
    expect(r.drone).toBeGreaterThan(0);
    expect(r.dronePct).toBeGreaterThan(0);
    expect(r.girlPct + r.dronePct + r.companionPct).toBeCloseTo(100);
  });

  it('동료 더블샷 100%면 동료 DPS 2배', () => {
    const stats1: StatsFlat = {
      ...baseStats,
      compAttack: 50_000,
      compNormalMonDmg: 100,
      compDoubleShot: 0,
    };
    const stats2: StatsFlat = { ...stats1, compDoubleShot: 100 };
    const r1 = calcDps(stats1, DEFAULT_ENV);
    const r2 = calcDps(stats2, DEFAULT_ENV);
    expect(r2.companion).toBeCloseTo(r1.companion * 2);
  });

  it('합산 = 부분의 합', () => {
    const stats: StatsFlat = {
      ...baseStats,
      droneAttack: 50_000,
      droneNormalMonDmg: 100,
      compAttack: 30_000,
      compNormalMonDmg: 100,
    };
    const r = calcDps(stats, DEFAULT_ENV);
    expect(r.total).toBeCloseTo(r.girl + r.drone + r.companion);
  });
});

describe('calcSurvival — 생존력', () => {
  it('생명력 100K + 전체 생명력 50% → 150K', () => {
    const r = calcSurvival({ ...DEFAULT_STATS, hp: 100_000, totalHpInc: 50 });
    expect(r.effectiveHp).toBeCloseTo(150_000);
  });

  it('회복력 1000 + 전체 회복력 100% → 4000/초 (0.5초당 ×2)', () => {
    const r = calcSurvival({ ...DEFAULT_STATS, recovery: 1000, totalRecoveryInc: 100 });
    // (1000 × 2.0) × 2 = 4000
    expect(r.effectiveRecoveryPerSec).toBeCloseTo(4000);
  });
});
