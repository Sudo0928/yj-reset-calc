// 출처: src/data/gold.ts (MOONLIGHT, EXCHANGE_RATE, GOLD_BUFF_MYTH_BONUS) + 카톡 토론 (네이샤·필드수왕)
// 다이아 의사결정: 같은 다이아 N개를 다른 재화로 쓸 때 ROI 비교

import { MOONLIGHT, EXCHANGE_RATE } from '@/data/gold';
import type {
  DiamondAllocationInput, DiamondAllocationResult, AllocationCard,
  BuffBepInput, BuffBepResult,
  ReclimbInput, ReclimbResult,
} from './types';

// ─── 다이아 분배 ROI ─────────────────────────────────────

export function calcDiamondAllocation(input: DiamondAllocationInput): DiamondAllocationResult {
  const { diamonds, goldPerDiamondShop, premiumDaysPerDiamond, slimePackDaysPerDiamond, goldPerMinMeasured } = input;
  const cards: AllocationCard[] = [];

  // 1) 골드 직구 (다이아샵 골드 패키지)
  if (goldPerDiamondShop > 0) {
    const totalGold = diamonds * goldPerDiamondShop;
    cards.push({
      id: 'gold-shop',
      label: '골드 직구 (다이아샵)',
      amount: totalGold,
      unit: '골드',
      diamondPerUnit: 1 / goldPerDiamondShop,
      netDiamondValue: diamonds, // 자기 자신 = 손익분기
      roi: 1.0,
      note: `다이아 1개 = ${goldPerDiamondShop.toLocaleString()}골드 환율`,
    });
  }

  // 2) 뽑기권 (1뽑 80다이아 / 10연 720다이아, 평균 76다이아)
  const ticketCount = diamonds / EXCHANGE_RATE.summonTicket;
  cards.push({
    id: 'summon-ticket',
    label: '뽑기권 (장비/스킬/동료)',
    amount: ticketCount,
    unit: '개',
    diamondPerUnit: EXCHANGE_RATE.summonTicket,
    netDiamondValue: diamonds, // 자체 = 환율 그대로
    roi: 1.0,
    note: `1뽑 80다이아, 10연 720다이아 평균 ${EXCHANGE_RATE.summonTicket}다이아`,
  });

  // 3) 달빛 충전 (300다이아=100달빛=슬라임100마리, 합성보상 ROI 1.16배)
  const moonlightCharges = diamonds / MOONLIGHT.diamondPerCharge;
  const totalMoonlight = moonlightCharges * MOONLIGHT.moonlightPerCharge;
  // 1000회 뽑기에 3000다이아 → 3486다이아 가치 = 1.16배
  const moonlightRoi = 1.162;
  cards.push({
    id: 'moonlight',
    label: '달빛 충전 (슬라임 농장)',
    amount: totalMoonlight,
    unit: '달빛 (슬라임 N마리)',
    diamondPerUnit: MOONLIGHT.diamondPerCharge / MOONLIGHT.moonlightPerCharge,
    netDiamondValue: diamonds * moonlightRoi,
    roi: moonlightRoi,
    note: `300다이아=100달빛, 합성보상 ROI 약 1.16배`,
  });

  // 4) 광제 일수
  if (premiumDaysPerDiamond > 0) {
    const days = diamonds / premiumDaysPerDiamond;
    // 광제 1일 가치 = 24h × 30분(상자 단축) / 24h ≈ 시간 가치 (사용자 측정 골드 기반)
    // 단순화: 1일에 30분 × n상자 단축 → 분당 측정 골드 기반 시간 가치
    const dailyTimeSavedMinutes = 30 * 4; // 가정: 하루 평균 4상자 × 30분 = 120분
    const valuePerDayGold = dailyTimeSavedMinutes * goldPerMinMeasured;
    const totalGold = days * valuePerDayGold;
    cards.push({
      id: 'premium',
      label: '광고제거 (광제)',
      amount: days,
      unit: '일',
      diamondPerUnit: premiumDaysPerDiamond,
      netDiamondValue: 0, // 다이아 환산은 다이아샵 환율 필요
      roi: 0,
      note: `${days.toFixed(1)}일 사용 → 시간 절약 ${formatTime(dailyTimeSavedMinutes * days)} → ${(totalGold).toLocaleString(undefined, { maximumFractionDigits: 0 })}골드 가치`,
    });
  }

  // 5) 슬라임 마스터팩 일수
  if (slimePackDaysPerDiamond > 0) {
    const days = diamonds / slimePackDaysPerDiamond;
    cards.push({
      id: 'slime-pack',
      label: '슬라임 마스터 팩',
      amount: days,
      unit: '일',
      diamondPerUnit: slimePackDaysPerDiamond,
      netDiamondValue: 0,
      roi: 0,
      note: `${days.toFixed(1)}일 동안 빛파편 ×2 효과`,
    });
  }

  // 정렬: ROI 내림차순 (단, ROI 0인 항목은 마지막)
  cards.sort((a, b) => {
    if (a.roi === 0 && b.roi === 0) return 0;
    if (a.roi === 0) return 1;
    if (b.roi === 0) return -1;
    return b.roi - a.roi;
  });

  const bestCardId = cards.find((c) => c.roi > 0)?.id ?? '';
  return { cards, bestCardId };
}

function formatTime(minutes: number): string {
  if (minutes < 60) return `${minutes.toFixed(0)}분`;
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  if (h < 24) return `${h}시간 ${m}분`;
  const d = Math.floor(h / 24);
  return `${d}일 ${h % 24}시간`;
}

// ─── 신화 버프작 BEP ─────────────────────────────────────

export function calcBuffBep(input: BuffBepInput): BuffBepResult {
  const { buffCostDiamond, currentGoldAcq, goldPerMinMeasured, buffDurationMin, buffBonusPct } = input;

  // 골획 N% 추가 → 최종값 증가율 = (bonus / current) × 100 (%)
  // (Phase 4 골드획득下편 신화벞 효율 표 공식)
  const finalValueIncreasePct = currentGoldAcq > 0 ? (buffBonusPct / currentGoldAcq) * 100 : 0;
  const extraGoldDuringBuff = goldPerMinMeasured * buffDurationMin * (finalValueIncreasePct / 100);
  const goldPerDiamondCost = buffCostDiamond > 0 ? extraGoldDuringBuff / buffCostDiamond : 0;

  // BEP는 사용자가 다이아→골드 환율을 알아야 정확. 여기서는 "버프 1회 동안 다이아당 추가 골드"만 노출
  const bepMinutes: number | null = null;

  const bepSummary = currentGoldAcq <= 0
    ? '현재 골획% 입력 필요'
    : `현재 골획 ${currentGoldAcq.toFixed(0)}% → 신화 +${buffBonusPct}%로 최종값 +${finalValueIncreasePct.toFixed(1)}% 증가`;

  return {
    finalValueIncreasePct,
    extraGoldDuringBuff,
    goldPerDiamondCost,
    bepMinutes,
    bepSummary,
  };
}

// ─── 재등반 ROI 비교 ─────────────────────────────────────

export function calcReclimb(input: ReclimbInput): ReclimbResult {
  const ranked = input.candidates
    .map((c) => ({ ...c, goldPerHour: c.goldPerMin * 60, rank: 0 }))
    .sort((a, b) => b.goldPerHour - a.goldPerHour)
    .map((c, i) => ({ ...c, rank: i + 1 }));

  const best = ranked.find((c) => c.goldPerHour > 0) ?? null;
  return { best, ranked };
}
