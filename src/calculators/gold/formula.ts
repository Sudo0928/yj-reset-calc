// 출처: 골드획득上/下편 (YUI, 2026-04-18/20), 빛의파편수급편 (YUI, 2026-03-04), 슬라임합성보상편 (YUI, 2026-03-12)
import { lightShardBySlimeLevel, LIGHT_SHARD_MULTIPLIER, MOONLIGHT } from '@/data/gold';
import type { GoldInput, GoldResult, LightShardInput, LightShardResult } from './types';

// ─── 골드 효율 비교 ──────────────────────────────────────────────────────────

// 골드 획득량 배율 계산 (실제 기본값 몰라도 비율 비교 가능)
// 버림은 기본값이 작을때만 의미가 있으므로 비율 계산에서는 생략
function goldMultiplier(goldAcqPct: number, totalGoldPct: number): number {
  return (goldAcqPct / 100) * (totalGoldPct / 100);
}

export function calcGold(input: GoldInput): GoldResult {
  const { currentGoldPerMin, goldAcqBonus, totalGoldBonus,
    targetGoldAcqBonus, targetTotalGoldBonus, hoursPerDay } = input;

  const currentMult = goldMultiplier(goldAcqBonus, totalGoldBonus);
  const targetMult = goldMultiplier(targetGoldAcqBonus, targetTotalGoldBonus);
  const changeRatio = currentMult > 0 ? targetMult / currentMult : 0;
  const deltaPercent = (changeRatio - 1) * 100;

  const cur = currentGoldPerMin;
  const tgt = currentGoldPerMin * changeRatio;
  const minutesPerDay = hoursPerDay * 60;

  return {
    currentMultiplier: currentMult,
    targetMultiplier: targetMult,
    changeRatio,
    deltaPercent,

    currentPerMin: cur,
    currentPerHour: cur * 60,
    currentPerDay: cur * minutesPerDay,
    currentPerWeek: cur * minutesPerDay * 7,

    targetPerMin: tgt,
    targetPerHour: tgt * 60,
    targetPerDay: tgt * minutesPerDay,
    targetPerWeek: tgt * minutesPerDay * 7,
  };
}

// ─── 빛의파편 + 달빛 효율 ────────────────────────────────────────────────────

// 소환 횟수 → 합성 횟수 (이진수 1의 개수만큼 남은 슬라임)
// 정확한 방법: n회 소환 → floor(log2(n)) 개의 슬라임이 남음 → 합성 횟수 = n - bitCount(n)
function bitCount(n: number): number {
  let count = 0;
  let num = Math.floor(n);
  while (num > 0) { count += num & 1; num >>= 1; }
  return count;
}

function summonToSynthesis(summons: number): number {
  const n = Math.floor(summons);
  return n - bitCount(n);
}

// 새식구 반영 합성 횟수 (기댓값)
function applyNewMember(baseSynth: number, newMemberPct: number): number {
  if (newMemberPct <= 0) return baseSynth;
  return baseSynth / (1 - newMemberPct / 100);
}

export function calcLightShard(input: LightShardInput): LightShardResult {
  const {
    avgSlimeLevel, hasResearchBonus, hasMasterPack,
    moonlightCharges, dailyFreeMoonlight, newMemberRate, days,
  } = input;

  // 배율 결정
  let multiplier = LIGHT_SHARD_MULTIPLIER.base;
  if (hasResearchBonus && hasMasterPack) multiplier = LIGHT_SHARD_MULTIPLIER.researchAndPack;
  else if (hasResearchBonus) multiplier = LIGHT_SHARD_MULTIPLIER.research;
  else if (hasMasterPack) multiplier = LIGHT_SHARD_MULTIPLIER.masterPack;

  // 1회 합성당 파편 기댓값
  const shardPerSynthesis = lightShardBySlimeLevel(avgSlimeLevel) * multiplier;

  // 기간 내 달빛 총량
  const freeMoonlightTotal = dailyFreeMoonlight * days;
  const chargedMoonlightTotal = moonlightCharges * MOONLIGHT.moonlightPerCharge;
  const totalMoonlight = freeMoonlightTotal + chargedMoonlightTotal;

  // 소환 → 합성 → 파편
  const totalSummons = totalMoonlight * MOONLIGHT.slimePerMoonlight;
  const baseSynth = summonToSynthesis(totalSummons);
  const totalSynth = applyNewMember(baseSynth, newMemberRate);
  const avgSynthPerSummon = totalSummons > 0 ? totalSynth / totalSummons : 0;
  const totalShards = Math.floor(totalSynth * shardPerSynthesis);

  // 달빛 충전 효율 (다이아 기준)
  const diamondInvested = moonlightCharges * MOONLIGHT.diamondPerCharge;
  const chargedSummons = chargedMoonlightTotal;
  const chargedSynth = applyNewMember(summonToSynthesis(chargedSummons), newMemberRate);
  const rewardCount = Math.floor(chargedSynth / MOONLIGHT.synthesisPerReward);
  // 보상 4종 순환: 50다이아 / 장비3 / 스킬3 / 동료3
  // 평균: 뽑기권 9개 + 다이아 50개 (4회 보상 기준)
  const ticketsPerFullCycle = 3 * 3; // 뽑기권 3종 × 3개
  const diamondPerFullCycle = MOONLIGHT.rewardDiamond;
  const cyclesCount = rewardCount / MOONLIGHT.rewardTypes;
  const ticketsReturned = Math.floor(cyclesCount * ticketsPerFullCycle);
  const diamondFromReward = Math.floor(cyclesCount * diamondPerFullCycle);
  const diamondReturned = Math.floor(
    ticketsReturned * MOONLIGHT.ticketValueDiamond + diamondFromReward,
  );
  const roi = diamondInvested > 0 ? diamondReturned / diamondInvested : 0;

  return {
    shardPerSynthesis,
    multiplier,
    totalSynth: Math.floor(totalSynth),
    totalShards,
    totalMoonlight: Math.floor(totalMoonlight),
    totalSummons: Math.floor(totalSummons),
    avgSynthPerSummon,
    diamondInvested,
    diamondReturned,
    roi,
    rewardCount,
    ticketsReturned,
    diamondFromReward,
  };
}
