// 출처: Phase 3 데미지편 공식 + 사용자 인게임 33필드
// 여고생/드론/동료 DPS 분해 — Phase 10 빌드 비교와 Phase 11 진단에서 공유

import { DEFAULT_ASSUMPTIONS, type StatsFlat, type EnvInput, type AssumptionsInput } from '@/data/statsSchema';

const DRONE_DEFAULT_ATTACK_SPEED = 1.0; // 회/초 추정 (드론 공속 필드 미존재)

interface DpsBreakdown {
  girl: number;
  drone: number;
  companion: number;
  total: number;
  girlPct: number;
  dronePct: number;
  companionPct: number;
}

// ─── 여고생 DPS ─────────────────────────────────────────
function calcGirlDps(stats: StatsFlat, env: EnvInput, a: AssumptionsInput): number {
  const atk = stats.attack ?? 0;
  if (atk <= 0) return 0;

  const monsterDmg = env.isBoss ? (stats.bossMonsterDmg ?? 100) : (stats.normalMonsterDmg ?? 100);
  const allDmg = stats.allDmgInc ?? 100;

  // 평타와 스킬 비중 가변 (assumptions.skillVsNormalRatio, 기본 0.5)
  const normalMult = (stats.normalAttackDmg ?? 100) / 100 + monsterDmg / 100 + allDmg / 100 - 2;
  const skillMult = (stats.skillDmg ?? 100) / 100 + monsterDmg / 100 + allDmg / 100 - 2;
  const ratio = a.skillVsNormalRatio;
  const avgMult = normalMult * (1 - ratio) + skillMult * ratio;
  if (avgMult <= 0) return 0;

  // 치명타 기대 배수 (assumptions.critBaseMultiplier 가변)
  const critRate = (stats.critRate ?? 0) / 100;
  const critMult = a.critBaseMultiplier + (stats.critDmg ?? 50) / 100;
  const expectedMultiplier = (1 - critRate) + critRate * critMult;

  // 공격속도 % → 배율 (100% = 1.0회/초 기본)
  const aspdMult = (stats.attackSpeed ?? 100) / 100;

  return atk * avgMult * expectedMultiplier * aspdMult;
}

// ─── 드론 DPS ───────────────────────────────────────────
function calcDroneDps(stats: StatsFlat, env: EnvInput, a: AssumptionsInput): number {
  // 드론 공격력은 여고생 공격력 대비 % (사용자 입력값 그대로)
  const droneAttackPct = stats.droneAttack ?? 0;
  const baseAtk = stats.attack ?? 0;
  const atk = baseAtk * (droneAttackPct / 100);
  if (atk <= 0) return 0;

  const monsterDmg = env.isBoss ? (stats.droneBossMonDmg ?? 0) : (stats.droneNormalMonDmg ?? 0);
  const allDmg = stats.allDmgInc ?? 100;

  const baseMult = monsterDmg / 100 + (allDmg - 100) / 100;
  const finalMult = Math.max(0, baseMult);

  const critRate = (stats.droneCritRate ?? 0) / 100;
  const critMult = a.droneCritBaseMultiplier + (stats.droneCritDmg ?? 0) / 100;
  const expectedMultiplier = (1 - critRate) + critRate * critMult;

  return atk * finalMult * expectedMultiplier * DRONE_DEFAULT_ATTACK_SPEED;
}

// ─── 동료 DPS ───────────────────────────────────────────
function calcCompanionDps(stats: StatsFlat, env: EnvInput, a: AssumptionsInput): number {
  // 동료 공격력은 여고생 공격력 대비 % (예: +266%)
  const compAttackPct = stats.compAttack ?? 0;
  const baseAtk = stats.attack ?? 0;
  const atk = baseAtk * (compAttackPct / 100);
  if (atk <= 0) return 0;

  const monsterDmg = env.isBoss ? (stats.compBossMonDmg ?? 0) : (stats.compNormalMonDmg ?? 0);
  const allDmg = stats.allDmgInc ?? 100;
  const compDmg = (stats.compDmg ?? 100) / 100;

  const baseMult = monsterDmg / 100 + (allDmg - 100) / 100;
  const finalMult = Math.max(0, baseMult);

  const doubleShotMult = 1 + (stats.compDoubleShot ?? 0) / 100;

  const critRate = (stats.compCritRate ?? 0) / 100;
  const critMult = a.companionCritBaseMultiplier + (stats.compCritDmg ?? 0) / 100;
  const expectedMultiplier = (1 - critRate) + critRate * critMult;

  // 동료 공격속도 % → 배율 (100% = 1.0회/초)
  const aspdMult = (stats.compAttackSpeed ?? 100) / 100;

  return atk * compDmg * finalMult * doubleShotMult * expectedMultiplier * aspdMult;
}

// ─── 통합 DPS ───────────────────────────────────────────
export function calcDps(stats: StatsFlat, env: EnvInput, assumptions: AssumptionsInput = DEFAULT_ASSUMPTIONS): DpsBreakdown {
  const girl = calcGirlDps(stats, env, assumptions);
  const drone = calcDroneDps(stats, env, assumptions);
  const companion = calcCompanionDps(stats, env, assumptions);
  const total = girl + drone + companion;

  return {
    girl,
    drone,
    companion,
    total,
    girlPct: total > 0 ? (girl / total) * 100 : 0,
    dronePct: total > 0 ? (drone / total) * 100 : 0,
    companionPct: total > 0 ? (companion / total) * 100 : 0,
  };
}

// ─── 생존력 ─────────────────────────────────────────────
export function calcSurvival(stats: StatsFlat) {
  const baseHp = stats.hp ?? 0;
  const totalHp = baseHp * (1 + (stats.totalHpInc ?? 0) / 100);

  const baseRecovery = stats.recovery ?? 0;
  const totalRecovery = baseRecovery * (1 + (stats.totalRecoveryInc ?? 0) / 100);
  const recoveryPerSec = totalRecovery * 2; // 0.5초당 회복 → ×2 = 초당

  return {
    effectiveHp: totalHp,
    effectiveRecoveryPerSec: recoveryPerSec,
    evasionPct: stats.evasion ?? 0,
  };
}

export type { DpsBreakdown };
