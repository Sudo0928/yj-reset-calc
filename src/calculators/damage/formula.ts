// 출처: 네이버 게임 라운지 — 데미지편 (YUI, 2026-03-08)
// 수치는 추정치이며 인게임과 ±5% 오차가 있을 수 있습니다.

import { getWorldStage } from '@/data/worldLimits';
import { DEFAULT_CRIT_BASE_MULTIPLIER } from '@/data/damage';
import type { DamageInput, DamageResult, SensitivityItem } from './types';

// ─── 핵심 공식 ───────────────────────────────────────────────────────────────

function calcDamageMultiplier(
  primaryDmgPct: number,   // 기본공격피해량 또는 스킬피해량 (%)
  monsterDmgPct: number,   // 일반/보스 몬스터 피해량 (%)
  allDmgPct: number,       // 모든 피해량 증가 (%)
): number {
  // 데미지편 공식: (피해량A + 피해량B + 피해량C - 2)
  // 모두 ÷100 하여 소수화 (100% = 1.0)
  return (primaryDmgPct / 100) + (monsterDmgPct / 100) + (allDmgPct / 100) - 2;
}

function critMultiplier(critDmgBonus: number): number {
  // 기본 배수(1.5 추정) + 치명타 피해량 증가
  // 실제 공식 미확인: 기본 1.5 + bonus/100 vs (1 + (50+bonus)/100)
  return DEFAULT_CRIT_BASE_MULTIPLIER + critDmgBonus / 100;
}

function applyAttr(base: number, attrPct: number, applied: boolean): number {
  if (!applied || attrPct <= 0) return base;
  return base * (1 + attrPct / 100);
}

// ─── 주 계산 함수 ─────────────────────────────────────────────────────────────

export function calcDamage(input: DamageInput): DamageResult {
  const {
    attack,
    normalAttackDmg,
    skillDmg,
    normalMonsterDmg,
    bossMonsterDmg,
    allDmgBonus,
    critRate,
    critDmgBonus,
    skillCoeff,
    attributeCoeff,
    attributeApplied,
    attacksPerSec,
    skillCooldown,
    isBoss,
    worldStage,
    currentStatLevel,
  } = input;

  const monsterDmg = isBoss ? bossMonsterDmg : normalMonsterDmg;

  // 평타
  const normalMult = calcDamageMultiplier(normalAttackDmg, monsterDmg, allDmgBonus);
  const normalHit = attack * Math.max(0, normalMult);
  const critMult = critMultiplier(critDmgBonus);
  const normalCrit = normalHit * critMult;
  const normalExpected = normalHit * (1 - critRate / 100) + normalCrit * (critRate / 100);

  // 스킬
  const skillMult = calcDamageMultiplier(skillDmg, monsterDmg, allDmgBonus);
  const skillBase = attack * Math.max(0, skillMult) * (skillCoeff / 100);
  const skillHit = applyAttr(skillBase, attributeCoeff, attributeApplied);
  const skillCrit = skillHit * critMult;
  const skillExpected = skillHit * (1 - critRate / 100) + skillCrit * (critRate / 100);

  // DPS (평타 + 스킬 기대치, 스킬 쿨다운 고려)
  const skillDps = skillCooldown > 0 ? skillExpected / skillCooldown : 0;
  const dps = normalExpected * attacksPerSec + skillDps;

  // 월드 제한
  const worldInfo = getWorldStage(worldStage);
  const worldStatLimit = worldInfo?.statLimit ?? null;
  const isOverStatLimit = worldStatLimit !== null && currentStatLevel > worldStatLimit;

  // 민감도 계산 (각 항목 +1% 시 normalExpected 변화율)
  const sensitivity = calcSensitivity(input, normalExpected);

  return {
    normalHit,
    normalCrit,
    normalExpected,
    skillHit,
    skillCrit,
    skillExpected,
    dps,
    worldStatLimit,
    isOverStatLimit,
    sensitivity,
  };
}

// ─── 민감도 ──────────────────────────────────────────────────────────────────

function calcSensitivity(base: DamageInput, baseResult: number): SensitivityItem[] {
  if (baseResult === 0) return [];

  const items: Array<{ key: keyof DamageInput; label: string; delta: number }> = [
    { key: 'attack',            label: '공격력',         delta: 0 },
    { key: 'normalAttackDmg',   label: '기본공격피해량',  delta: 0 },
    { key: 'allDmgBonus',       label: '모든피해량증가',  delta: 0 },
    { key: 'critRate',          label: '치명타확률',      delta: 0 },
    { key: 'critDmgBonus',      label: '치명타피해량',    delta: 0 },
    { key: 'skillDmg',          label: '스킬피해량',      delta: 0 },
  ];

  for (const item of items) {
    const modified = { ...base, [item.key]: (base[item.key] as number) * 1.01 };
    const newResult = calcDamage(modified).normalExpected;
    item.delta = baseResult > 0 ? ((newResult - baseResult) / baseResult) * 100 : 0;
  }

  return items.sort((a, b) => b.delta - a.delta);
}
