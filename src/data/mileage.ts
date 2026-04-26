// 출처: 라운지 상점편 (YUI, 2026-03-22)

export const MILEAGE_RATES = {
  general: 0.01,    // 일반 결제 1%
  diamond: 0.05,    // 다이아 결제 5% (VIP팩 보유 시)
} as const;

export function calcMileage(spendAmount: number, isDiamondPay = false): number {
  return Math.floor(spendAmount * (isDiamondPay ? MILEAGE_RATES.diamond : MILEAGE_RATES.general));
}

export const lastUpdated = '2026-03-22';
