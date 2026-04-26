import { describe, it, expect } from 'vitest';
import { calcDps } from '@/calculators/dps/formula';
import { calcHourly } from '@/calculators/hourly/formula';
import { calcDiamondAllocation } from '@/calculators/decisions/formula';
import { DEFAULT_ASSUMPTIONS, DEFAULT_STATS, DEFAULT_ENV, hasCustomAssumptions } from '@/data/statsSchema';
import { DEFAULT_DIAMOND_INPUT } from '@/calculators/decisions/types';

describe('assumptions — 회귀 + 가변성', () => {
  it('hasCustomAssumptions: default면 false', () => {
    expect(hasCustomAssumptions(DEFAULT_ASSUMPTIONS)).toBe(false);
  });

  it('hasCustomAssumptions: 한 필드라도 변경하면 true', () => {
    expect(hasCustomAssumptions({ ...DEFAULT_ASSUMPTIONS, critBaseMultiplier: 2.0 })).toBe(true);
  });

  it('calcDps: assumptions 미지정 시 default와 동일', () => {
    const stats = { ...DEFAULT_STATS, attack: 100_000, attackSpeed: 100, normalAttackDmg: 100, normalMonsterDmg: 110, allDmgInc: 101, critRate: 50, critDmg: 50 };
    const a = calcDps(stats, DEFAULT_ENV);
    const b = calcDps(stats, DEFAULT_ENV, DEFAULT_ASSUMPTIONS);
    expect(a.total).toBeCloseTo(b.total);
  });

  it('calcDps: critBaseMultiplier 1.5 → 2.0 변경 시 치명타 50% 빌드 DPS 상승', () => {
    const stats = { ...DEFAULT_STATS, attack: 100_000, attackSpeed: 100, normalAttackDmg: 100, normalMonsterDmg: 110, allDmgInc: 101, critRate: 50, critDmg: 50 };
    const base = calcDps(stats, DEFAULT_ENV);
    const buffed = calcDps(stats, DEFAULT_ENV, { ...DEFAULT_ASSUMPTIONS, critBaseMultiplier: 2.0 });
    expect(buffed.total).toBeGreaterThan(base.total);
  });

  it('calcDps: skillVsNormalRatio 0.5 → 0 (평타만) 시 평타 mult 100% 사용', () => {
    const stats = { ...DEFAULT_STATS, attack: 100_000, attackSpeed: 100, normalAttackDmg: 200, skillDmg: 100, normalMonsterDmg: 100, allDmgInc: 100 };
    const ratio0 = calcDps(stats, DEFAULT_ENV, { ...DEFAULT_ASSUMPTIONS, skillVsNormalRatio: 0 });
    const ratio1 = calcDps(stats, DEFAULT_ENV, { ...DEFAULT_ASSUMPTIONS, skillVsNormalRatio: 1 });
    expect(ratio0.girl).toBeGreaterThan(ratio1.girl); // 평타 200% > 스킬 100%
  });

  it('calcHourly: slimeSynthPerHour 4 → 8 시 시간당 파편 2배', () => {
    const env = { ...DEFAULT_ENV, slimeAvgLevel: 10 };
    const r4 = calcHourly({ stats: DEFAULT_STATS, env, mode: 'measured', hoursPerDay: 24 }, { ...DEFAULT_ASSUMPTIONS, slimeSynthPerHour: 4 });
    const r8 = calcHourly({ stats: DEFAULT_STATS, env, mode: 'measured', hoursPerDay: 24 }, { ...DEFAULT_ASSUMPTIONS, slimeSynthPerHour: 8 });
    expect(r8.shardPerHour).toBeCloseTo(r4.shardPerHour * 2);
  });

  it('calcDiamondAllocation: moonlightRoi 가변성', () => {
    const r1 = calcDiamondAllocation({ ...DEFAULT_DIAMOND_INPUT, diamonds: 3000 }, { ...DEFAULT_ASSUMPTIONS, moonlightRoi: 1.16 });
    const r2 = calcDiamondAllocation({ ...DEFAULT_DIAMOND_INPUT, diamonds: 3000 }, { ...DEFAULT_ASSUMPTIONS, moonlightRoi: 1.46 });
    const m1 = r1.cards.find((c) => c.id === 'moonlight')!;
    const m2 = r2.cards.find((c) => c.id === 'moonlight')!;
    expect(m2.roi).toBeGreaterThan(m1.roi);
  });
});
