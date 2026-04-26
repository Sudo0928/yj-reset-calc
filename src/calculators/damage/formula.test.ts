import { describe, it, expect } from 'vitest';
import { calcDamage } from './formula';
import { DEFAULT_INPUT, type DamageInput } from './types';

const baseInput: DamageInput = {
  ...DEFAULT_INPUT,
  attack: 55_700_000,
  normalAttackDmg: 100,
  normalMonsterDmg: 110,
  bossMonsterDmg: 100,
  allDmgBonus: 101,
  critRate: 0,
  critDmgBonus: 50,
};

describe('calcDamage — 데미지편 검증 시나리오', () => {
  it('데미지편 예시: 55.7M × (1.0 + 1.1 + 1.01 - 2) ≈ 61.27M', () => {
    const result = calcDamage(baseInput);
    // 1.0 + 1.1 + 1.01 - 2 = 1.11
    // 55.7M × 1.11 = 61.827M
    expect(result.normalHit).toBeCloseTo(55_700_000 * 1.11, -3);
  });

  it('치명타 확률 0%이면 기대치 = 일반 타격', () => {
    const result = calcDamage({ ...baseInput, critRate: 0 });
    expect(result.normalExpected).toBeCloseTo(result.normalHit);
  });

  it('치명타 확률 100%이면 기대치 = 치명타 타격', () => {
    const result = calcDamage({ ...baseInput, critRate: 100 });
    expect(result.normalExpected).toBeCloseTo(result.normalCrit);
  });

  it('치명타 배수 = 기본 1.5 + bonus/100', () => {
    const result = calcDamage({ ...baseInput, critDmgBonus: 50 });
    // 1.5 + 0.5 = 2.0
    expect(result.normalCrit / result.normalHit).toBeCloseTo(2.0);
  });

  it('보스 토글 시 보스 피해량 적용', () => {
    const normal = calcDamage({ ...baseInput, isBoss: false });
    const boss = calcDamage({ ...baseInput, isBoss: true, bossMonsterDmg: 150 });
    expect(boss.normalHit).toBeGreaterThan(normal.normalHit);
  });

  it('스킬 데미지 = 평타 공식 × 스킬계수', () => {
    const result = calcDamage({ ...baseInput, skillDmg: 100, skillCoeff: 2000, attributeCoeff: 0 });
    // 스킬 mult = (1.0 + 1.1 + 1.01 - 2) = 1.11
    // base = 55.7M × 1.11 × 20 = 약 1,236M
    expect(result.skillHit).toBeCloseTo(55_700_000 * 1.11 * 20, -4);
  });

  it('민감도 무한 재귀 가드: _withSensitivity=false', () => {
    const result = calcDamage(baseInput, false);
    expect(result.sensitivity).toEqual([]);
  });

  it('월드 제한 스텟 초과 감지', () => {
    const result = calcDamage({ ...baseInput, worldStage: 14, currentStatLevel: 80_000 });
    // 14단계 절망 = 75,000 → 80,000은 초과
    expect(result.isOverStatLimit).toBe(true);
    expect(result.worldStatLimit).toBe(75_000);
  });
});
