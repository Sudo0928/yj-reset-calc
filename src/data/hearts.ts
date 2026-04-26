// 출처: 라운지 하트 효율표 (존버, 2026-03-14) + Phase 12.2 이미지 분석

// 하트 환율
export const HEART_RATES = {
  // 카드뽑기 1회 = 10 하트
  cardPullCost: 10,
  // 1다이아 = 1하트 (기본 환율, 광고 없는 경우)
  diaPerHeart: 1,
  // 깡 다이아샵 환율 (광고제거 패키지에 포함되지 않은 경우)
  rawDiaPerHeart: 3,
} as const;

// 하트 → 카드뽑 환산
// 10 하트 = 1뽑기 → 다이아 환산: 10 (기본) / 30 (깡)
// 카드뽑 1회 = 80다이아 (1뽑) / 76다이아 (10연 평균)
// 따라서 하트로 카드뽑하는 게 깡다이아 직구 (76)보다 효율적.

export function heartsToDiamonds(hearts: number, raw = false): number {
  return hearts * (raw ? HEART_RATES.rawDiaPerHeart : HEART_RATES.diaPerHeart);
}

export function heartsToPulls(hearts: number): number {
  return Math.floor(hearts / HEART_RATES.cardPullCost);
}

export const lastUpdated = '2026-03-14';
