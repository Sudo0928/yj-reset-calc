// 출처: Phase 4 골드획득편 + 빛파편수급편 + 사용자 인게임 스펙
// 시간당 자원 시뮬 — 게임이 보여주지 않는 누적 산출

import { calcLightShard } from '@/calculators/gold/formula';
import { LIGHT_SHARD_MULTIPLIER } from '@/data/gold';
import type { HourlyInput, HourlyResult } from './types';

const SYNTHESIS_PER_HOUR_ASSUMPTION = 4; // 평균 합성 4회/시간 가정 (사용자 보정 필요시 추후 입력)

export function calcHourly(input: HourlyInput): HourlyResult {
  const { stats, env, mode, hoursPerDay } = input;

  // ─── 골드 ─────────────────────────────────────────────
  let goldPerMin = 0;
  let goldNote = '';

  if (mode === 'measured') {
    goldPerMin = env.measuredGoldPerMin;
    goldNote = '측정값 기반: 입력한 분당 골드를 그대로 곱셈';
  } else {
    // DPS 모드: 분당 처치수 × 몹 1마리당 골드
    // 우리는 DPS와 몹 HP 매핑을 모르므로 사용자 입력값을 사용
    const kills = env.killsPerMin;
    const goldPerKill = env.goldPerKill;
    goldPerMin = kills * goldPerKill;
    goldNote = `DPS 모드: ${kills}회/분 × ${goldPerKill} 골드/몹 = ${goldPerMin.toLocaleString()} 골드/분`;
  }

  // 효과 골획%/전골획%로 비율 보정 (사용자가 분당 측정 시 이미 반영됐을 수 있어 옵션)
  // 측정값 모드는 그대로, DPS 모드는 골획×전골획 적용
  if (mode === 'dps') {
    const goldMult = (stats.goldAcq! / 100) * (stats.totalGoldAcq! / 100);
    goldPerMin *= goldMult;
  }

  const goldPerHour = goldPerMin * 60;
  const minutesPerDay = hoursPerDay * 60;
  const goldPerDay = goldPerMin * minutesPerDay;
  const goldPerWeek = goldPerDay * 7;
  const goldPer30Day = goldPerDay * 30;

  // ─── 빛의파편 ──────────────────────────────────────────
  // 효과의 빛파편획득량증가% 반영
  // 슬라임 마스터 팩(×2) + 연구 +30%는 env에서 별도
  const baseShardMult =
    env.slimeMasterPack && env.hasResearchBonus ? LIGHT_SHARD_MULTIPLIER.researchAndPack
    : env.slimeMasterPack ? LIGHT_SHARD_MULTIPLIER.masterPack
    : env.hasResearchBonus ? LIGHT_SHARD_MULTIPLIER.research
    : LIGHT_SHARD_MULTIPLIER.base;

  // 효과 빛파편획득%는 추가 곱
  const effectShardBonus = 1 + (stats.lightShardAcq ?? 0) / 100;
  const totalShardMult = baseShardMult * effectShardBonus;

  const shardPerSynthesis = (env.slimeAvgLevel * env.slimeAvgLevel) * totalShardMult;
  const shardPerHour = shardPerSynthesis * SYNTHESIS_PER_HOUR_ASSUMPTION;
  const shardPerDay = shardPerHour * hoursPerDay;
  const shardPerWeek = shardPerDay * 7;

  // ─── 연구 시간 ──────────────────────────────────────────
  const redPct = stats.researchTimeRed ?? 0;
  const researchHoursPer1h = redPct >= 100 ? 0 : 1 / (1 - redPct / 100);

  // ─── 방치 보상 ──────────────────────────────────────────
  const idleRewardMultiplier = (stats.idleRewardTime ?? 100) / 100;
  const idleRewardHoursValue = 24 * idleRewardMultiplier;

  // ─── 누적 시뮬 (1, 6, 12, 24, 48, 72, 168 시간) ────────
  const checkpoints = [1, 6, 12, 24, 48, 72, 168];
  const cumulative = checkpoints.map((h) => ({
    hour: h,
    gold: goldPerHour * Math.min(h, hoursPerDay * Math.ceil(h / 24)),
    shard: shardPerHour * Math.min(h, hoursPerDay * Math.ceil(h / 24)),
  }));

  return {
    goldPerMin,
    goldPerHour,
    goldPerDay,
    goldPerWeek,
    goldPer30Day,
    goldMode: mode,
    goldNote,

    shardPerSynthesis,
    shardMultiplier: totalShardMult,
    shardPerHour,
    shardPerDay,
    shardPerWeek,

    researchHoursPer1h,
    researchTimeRedPct: redPct,

    idleRewardMultiplier,
    idleRewardHoursValue,

    cumulative,
  };
}

// 보조: 빛파편 1주 시뮬 (Phase 4 calcLightShard 위임)
export function calcWeeklyShard(slimeAvgLevel: number, hasMasterPack: boolean, hasResearchBonus: boolean) {
  return calcLightShard({
    avgSlimeLevel: slimeAvgLevel,
    hasResearchBonus,
    hasMasterPack,
    moonlightCharges: 0,
    dailyFreeMoonlight: 150,
    moonlightPouchLevel: 0,
    newMemberRate: 0,
    days: 7,
  });
}
