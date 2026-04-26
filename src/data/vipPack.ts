// 출처: 라운지 과금 추천 + 던전편 + Phase 12.2 이미지 분석 (황금 VIP 팩 30일)

export const VIP_PACK = {
  durationDays: 30,
  priceWon: 15000,           // 15,000원
  // 매일 지급
  dailyDia: 200,             // 매일 오전 9시 200 다이아
  dailyDungeonEntries: 1,    // 매일 모든 던전 1회 입장
  // 영구 효과
  goldAcqBonusPct: 20,       // 골드 획득량 +20%
  mileagePctOnDia: 5,        // 다이아 결제 시 마일리지 5% (일반 1%)
  // 즉시 지급 (구매 즉시 1회)
  instantDia: 1000,
  instantTicket: 100,
  instantPremiumPack: 30,    // ?
} as const;

// 30일 누적 가치 환산
export function vipPackTotalValue() {
  const { durationDays, dailyDia, instantDia, instantTicket } = VIP_PACK;
  const ticketValueDia = 76; // src/data/gold.ts EXCHANGE_RATE.summonTicket과 일치
  const totalDia = (dailyDia * durationDays) + instantDia;
  const totalTicketValue = instantTicket * ticketValueDia;
  return {
    totalDia,
    totalTicketValue,
    grandTotalDia: totalDia + totalTicketValue,
    perDayDia: (totalDia + totalTicketValue) / durationDays,
  };
}

// 광고제거 패키지 (1회 한정)
export const PREMIUM_PACK = {
  oneTimeOnly: true,
  effectMinutes: 30, // 상자 해제 시간 30분 단축 (이미 src/data/chests.ts에 명시)
};

// 슬라임 마스터 팩 (구매 효과)
export const SLIME_MASTER_PACK = {
  lightShardMultiplier: 2.0, // 빛파편 ×2
  // 가격은 사용자 입력 (배포 지역마다 다름)
};

export const lastUpdated = '2026-03-19';
