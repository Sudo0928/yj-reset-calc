// 출처: Phase 3 데미지편 공식 + 사용자 인게임 33필드
// 여고생/드론/동료 DPS 분해 — Phase 10 빌드 비교와 Phase 11 진단에서 공유

import type { StatsFlat, EnvInput } from '@/data/statsSchema';

const DRONE_BASE_CRIT_MULTIPLIER = 1.5; // 추정값 (Phase 11에서 사용자 검증)
const COMPANION_BASE_CRIT_MULTIPLIER = 1.5; // 추정값
const DRONE_DEFAULT_ATTACK_SPEED = 1.0; // 1초/회 추정 (사용자 보정 필요시 별도 필드)

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
function calcGirlDps(stats: StatsFlat, env: EnvInput): number {
  const atk = stats.attack ?? 0;
  if (atk <= 0) return 0;

  const monsterDmg = env.isBoss ? (stats.bossMonsterDmg ?? 100) : (stats.normalMonsterDmg ?? 100);
  const allDmg = stats.allDmgInc ?? 100;

  // 평균 피해 배율 (스펙 기반): 평타와 스킬을 평균. 스킬 발동 빈도 미확정이므로
  // 평타와 스킬 비중 50:50으로 단순화 (변경 시 Phase 11에서 사용자 보정)
  const normalMult = (stats.normalAttackDmg ?? 100) / 100 + monsterDmg / 100 + allDmg / 100 - 2;
  const skillMult = (stats.skillDmg ?? 100) / 100 + monsterDmg / 100 + allDmg / 100 - 2;
  const avgMult = (normalMult + skillMult) / 2;
  if (avgMult <= 0) return 0;

  // 치명타 기대 배수
  const critRate = (stats.critRate ?? 0) / 100;
  const critMult = 1.5 + (stats.critDmg ?? 50) / 100; // 기본 1.5 + 치명타피해%
  const expectedMultiplier = (1 - critRate) + critRate * critMult;

  // 공격속도 (회/초)
  const aspd = stats.attackSpeed ?? 1;

  return atk * avgMult * expectedMultiplier * aspd;
}

// ─── 드론 DPS ───────────────────────────────────────────
function calcDroneDps(stats: StatsFlat, env: EnvInput): number {
  const atk = stats.droneAttack ?? 0;
  if (atk <= 0) return 0;

  const monsterDmg = env.isBoss ? (stats.droneBossMonDmg ?? 0) : (stats.droneNormalMonDmg ?? 0);
  const allDmg = stats.allDmgInc ?? 100;

  // 드론은 데미지편 공식에 명시 없음 → 단순 곱연산 추정
  // 드론평타 = 드론공격력 × (1 + 드론몬피해%/100 + 모든피해%/100 - 1)
  // 즉 드론공격력 × (드론몬피해%/100 + 모든피해%/100)
  const baseMult = monsterDmg / 100 + (allDmg - 100) / 100;
  const finalMult = Math.max(0, baseMult);

  const critRate = (stats.droneCritRate ?? 0) / 100;
  const critMult = DRONE_BASE_CRIT_MULTIPLIER + (stats.droneCritDmg ?? 0) / 100;
  const expectedMultiplier = (1 - critRate) + critRate * critMult;

  return atk * finalMult * expectedMultiplier * DRONE_DEFAULT_ATTACK_SPEED;
}

// ─── 동료 DPS ───────────────────────────────────────────
function calcCompanionDps(stats: StatsFlat, env: EnvInput): number {
  const atk = stats.compAttack ?? 0;
  if (atk <= 0) return 0;

  const monsterDmg = env.isBoss ? (stats.compBossMonDmg ?? 0) : (stats.compNormalMonDmg ?? 0);
  const allDmg = stats.allDmgInc ?? 100;
  const compDmg = (stats.compDmg ?? 100) / 100; // 동료 피해량 %

  const baseMult = monsterDmg / 100 + (allDmg - 100) / 100;
  const finalMult = Math.max(0, baseMult);

  // 더블샷: 1발이 (1 + 더블샷%) 발 가치
  const doubleShotMult = 1 + (stats.compDoubleShot ?? 0) / 100;

  const critRate = (stats.compCritRate ?? 0) / 100;
  const critMult = COMPANION_BASE_CRIT_MULTIPLIER + (stats.compCritDmg ?? 0) / 100;
  const expectedMultiplier = (1 - critRate) + critRate * critMult;

  const aspd = stats.compAttackSpeed ?? 1;

  return atk * compDmg * finalMult * doubleShotMult * expectedMultiplier * aspd;
}

// ─── 통합 DPS ───────────────────────────────────────────
export function calcDps(stats: StatsFlat, env: EnvInput): DpsBreakdown {
  const girl = calcGirlDps(stats, env);
  const drone = calcDroneDps(stats, env);
  const companion = calcCompanionDps(stats, env);
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
