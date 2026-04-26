// 출처: 네이버 라운지 — 14단계 [절망] 보스체력 및 피격데미지 (시골쥐서울쥐, 2026-03-21)
// 이미지 표 직접 추출 (Phase 12.2 시각 분석)
// 14단계(절망) 1~100층 보스 HP·피격데미지·접근 유형
// 단위: T = 1조 (10^12), P = 1000T = 10^15

export interface BossStage {
  stage: number;          // 14-N의 N (1~100)
  hp: number;             // 단위: T (예: 386T = 386)
  hpUnit: 'T' | 'P';      // T(조) 또는 P(천조)
  damage: number;         // 피격 데미지 (단위 동일)
  damageUnit: 'T' | 'P';
  type: '근접' | '원거리';
}

export const BOSS_DESPAIR_14: BossStage[] = [
  // 14-1 ~ 14-50
  { stage: 1,  hp: 386, hpUnit: 'T', damage: 3.86, damageUnit: 'T', type: '근접' },
  { stage: 2,  hp: 386, hpUnit: 'T', damage: 3.86, damageUnit: 'T', type: '근접' },
  { stage: 3,  hp: 386, hpUnit: 'T', damage: 3.86, damageUnit: 'T', type: '근접' },
  { stage: 4,  hp: 387, hpUnit: 'T', damage: 3.87, damageUnit: 'T', type: '근접' },
  { stage: 5,  hp: 310, hpUnit: 'T', damage: 2.71, damageUnit: 'T', type: '원거리' },
  { stage: 6,  hp: 310, hpUnit: 'T', damage: 2.71, damageUnit: 'T', type: '원거리' },
  { stage: 7,  hp: 310, hpUnit: 'T', damage: 2.71, damageUnit: 'T', type: '원거리' },
  { stage: 8,  hp: 310, hpUnit: 'T', damage: 2.72, damageUnit: 'T', type: '원거리' },
  { stage: 9,  hp: 311, hpUnit: 'T', damage: 2.72, damageUnit: 'T', type: '원거리' },
  { stage: 10, hp: 342, hpUnit: 'T', damage: 2.99, damageUnit: 'T', type: '원거리' },
  { stage: 11, hp: 428, hpUnit: 'T', damage: 4.28, damageUnit: 'T', type: '근접' },
  { stage: 12, hp: 429, hpUnit: 'T', damage: 4.29, damageUnit: 'T', type: '근접' },
  { stage: 13, hp: 429, hpUnit: 'T', damage: 4.29, damageUnit: 'T', type: '근접' },
  { stage: 14, hp: 429, hpUnit: 'T', damage: 4.29, damageUnit: 'T', type: '근접' },
  { stage: 15, hp: 344, hpUnit: 'T', damage: 3.01, damageUnit: 'T', type: '원거리' },
  { stage: 16, hp: 344, hpUnit: 'T', damage: 3.01, damageUnit: 'T', type: '원거리' },
  { stage: 17, hp: 344, hpUnit: 'T', damage: 3.01, damageUnit: 'T', type: '원거리' },
  { stage: 18, hp: 345, hpUnit: 'T', damage: 3.02, damageUnit: 'T', type: '원거리' },
  { stage: 19, hp: 345, hpUnit: 'T', damage: 3.02, damageUnit: 'T', type: '원거리' },
  { stage: 20, hp: 380, hpUnit: 'T', damage: 3.32, damageUnit: 'T', type: '원거리' },
  { stage: 21, hp: 476, hpUnit: 'T', damage: 4.76, damageUnit: 'T', type: '근접' },
  { stage: 22, hp: 476, hpUnit: 'T', damage: 4.76, damageUnit: 'T', type: '근접' },
  { stage: 23, hp: 476, hpUnit: 'T', damage: 4.76, damageUnit: 'T', type: '근접' },
  { stage: 24, hp: 477, hpUnit: 'T', damage: 4.77, damageUnit: 'T', type: '근접' },
  { stage: 25, hp: 382, hpUnit: 'T', damage: 3.34, damageUnit: 'T', type: '원거리' },
  { stage: 26, hp: 382, hpUnit: 'T', damage: 3.34, damageUnit: 'T', type: '원거리' },
  { stage: 27, hp: 382, hpUnit: 'T', damage: 3.35, damageUnit: 'T', type: '원거리' },
  { stage: 28, hp: 383, hpUnit: 'T', damage: 3.35, damageUnit: 'T', type: '원거리' },
  { stage: 29, hp: 383, hpUnit: 'T', damage: 3.35, damageUnit: 'T', type: '원거리' },
  { stage: 30, hp: 422, hpUnit: 'T', damage: 3.69, damageUnit: 'T', type: '원거리' },
  { stage: 31, hp: 528, hpUnit: 'T', damage: 5.28, damageUnit: 'T', type: '근접' },
  { stage: 32, hp: 528, hpUnit: 'T', damage: 5.28, damageUnit: 'T', type: '근접' },
  { stage: 33, hp: 529, hpUnit: 'T', damage: 5.29, damageUnit: 'T', type: '근접' },
  { stage: 34, hp: 529, hpUnit: 'T', damage: 5.29, damageUnit: 'T', type: '근접' },
  { stage: 35, hp: 424, hpUnit: 'T', damage: 3.71, damageUnit: 'T', type: '원거리' },
  { stage: 36, hp: 424, hpUnit: 'T', damage: 3.71, damageUnit: 'T', type: '원거리' },
  { stage: 37, hp: 424, hpUnit: 'T', damage: 3.71, damageUnit: 'T', type: '원거리' },
  { stage: 38, hp: 425, hpUnit: 'T', damage: 3.72, damageUnit: 'T', type: '원거리' },
  { stage: 39, hp: 425, hpUnit: 'T', damage: 3.72, damageUnit: 'T', type: '원거리' },
  { stage: 40, hp: 468, hpUnit: 'T', damage: 4.1, damageUnit: 'T', type: '원거리' },
  { stage: 41, hp: 586, hpUnit: 'T', damage: 5.86, damageUnit: 'T', type: '근접' },
  { stage: 42, hp: 586, hpUnit: 'T', damage: 5.86, damageUnit: 'T', type: '근접' },
  { stage: 43, hp: 587, hpUnit: 'T', damage: 5.87, damageUnit: 'T', type: '근접' },
  { stage: 44, hp: 588, hpUnit: 'T', damage: 5.88, damageUnit: 'T', type: '근접' },
  { stage: 45, hp: 470, hpUnit: 'T', damage: 4.11, damageUnit: 'T', type: '원거리' },
  { stage: 46, hp: 471, hpUnit: 'T', damage: 4.12, damageUnit: 'T', type: '원거리' },
  { stage: 47, hp: 471, hpUnit: 'T', damage: 4.12, damageUnit: 'T', type: '원거리' },
  { stage: 48, hp: 472, hpUnit: 'T', damage: 4.13, damageUnit: 'T', type: '원거리' },
  { stage: 49, hp: 472, hpUnit: 'T', damage: 4.13, damageUnit: 'T', type: '원거리' },
  { stage: 50, hp: 520, hpUnit: 'T', damage: 4.55, damageUnit: 'T', type: '원거리' },

  // 14-51 ~ 14-100
  { stage: 51, hp: 650, hpUnit: 'T', damage: 6.5,  damageUnit: 'T', type: '근접' },
  { stage: 52, hp: 651, hpUnit: 'T', damage: 6.51, damageUnit: 'T', type: '근접' },
  { stage: 53, hp: 652, hpUnit: 'T', damage: 6.52, damageUnit: 'T', type: '근접' },
  { stage: 54, hp: 652, hpUnit: 'T', damage: 6.52, damageUnit: 'T', type: '근접' },
  { stage: 55, hp: 522, hpUnit: 'T', damage: 4.57, damageUnit: 'T', type: '원거리' },
  { stage: 56, hp: 523, hpUnit: 'T', damage: 4.58, damageUnit: 'T', type: '원거리' },
  { stage: 57, hp: 523, hpUnit: 'T', damage: 4.58, damageUnit: 'T', type: '원거리' },
  { stage: 58, hp: 523, hpUnit: 'T', damage: 4.58, damageUnit: 'T', type: '원거리' },
  { stage: 59, hp: 524, hpUnit: 'T', damage: 4.59, damageUnit: 'T', type: '원거리' },
  { stage: 60, hp: 577, hpUnit: 'T', damage: 5.05, damageUnit: 'T', type: '원거리' },
  { stage: 61, hp: 722, hpUnit: 'T', damage: 7.22, damageUnit: 'T', type: '근접' },
  { stage: 62, hp: 722, hpUnit: 'T', damage: 7.22, damageUnit: 'T', type: '근접' },
  { stage: 63, hp: 723, hpUnit: 'T', damage: 7.23, damageUnit: 'T', type: '근접' },
  { stage: 64, hp: 724, hpUnit: 'T', damage: 7.24, damageUnit: 'T', type: '근접' },
  { stage: 65, hp: 579, hpUnit: 'T', damage: 5.07, damageUnit: 'T', type: '원거리' },
  { stage: 66, hp: 580, hpUnit: 'T', damage: 5.07, damageUnit: 'T', type: '원거리' },
  { stage: 67, hp: 580, hpUnit: 'T', damage: 5.08, damageUnit: 'T', type: '원거리' },
  { stage: 68, hp: 581, hpUnit: 'T', damage: 5.08, damageUnit: 'T', type: '원거리' },
  { stage: 69, hp: 581, hpUnit: 'T', damage: 5.09, damageUnit: 'T', type: '원거리' },
  { stage: 70, hp: 640, hpUnit: 'T', damage: 5.6,  damageUnit: 'T', type: '원거리' },
  { stage: 71, hp: 801, hpUnit: 'T', damage: 8.01, damageUnit: 'T', type: '근접' },
  { stage: 72, hp: 802, hpUnit: 'T', damage: 8.02, damageUnit: 'T', type: '근접' },
  { stage: 73, hp: 802, hpUnit: 'T', damage: 8.02, damageUnit: 'T', type: '근접' },
  { stage: 74, hp: 803, hpUnit: 'T', damage: 8.03, damageUnit: 'T', type: '근접' },
  { stage: 75, hp: 643, hpUnit: 'T', damage: 5.63, damageUnit: 'T', type: '원거리' },
  { stage: 76, hp: 644, hpUnit: 'T', damage: 5.63, damageUnit: 'T', type: '원거리' },
  { stage: 77, hp: 644, hpUnit: 'T', damage: 5.64, damageUnit: 'T', type: '원거리' },
  { stage: 78, hp: 645, hpUnit: 'T', damage: 5.64, damageUnit: 'T', type: '원거리' },
  { stage: 79, hp: 645, hpUnit: 'T', damage: 5.65, damageUnit: 'T', type: '원거리' },
  { stage: 80, hp: 710, hpUnit: 'T', damage: 6.22, damageUnit: 'T', type: '원거리' },
  { stage: 81, hp: 889, hpUnit: 'T', damage: 8.89, damageUnit: 'T', type: '근접' },
  { stage: 82, hp: 890, hpUnit: 'T', damage: 8.9,  damageUnit: 'T', type: '근접' },
  { stage: 83, hp: 890, hpUnit: 'T', damage: 8.9,  damageUnit: 'T', type: '근접' },
  { stage: 84, hp: 891, hpUnit: 'T', damage: 8.91, damageUnit: 'T', type: '근접' },
  { stage: 85, hp: 714, hpUnit: 'T', damage: 6.24, damageUnit: 'T', type: '원거리' },
  { stage: 86, hp: 714, hpUnit: 'T', damage: 6.25, damageUnit: 'T', type: '원거리' },
  { stage: 87, hp: 715, hpUnit: 'T', damage: 6.25, damageUnit: 'T', type: '원거리' },
  { stage: 88, hp: 715, hpUnit: 'T', damage: 6.26, damageUnit: 'T', type: '원거리' },
  { stage: 89, hp: 716, hpUnit: 'T', damage: 6.26, damageUnit: 'T', type: '원거리' },
  { stage: 90, hp: 788, hpUnit: 'T', damage: 6.9,  damageUnit: 'T', type: '원거리' },
  { stage: 91, hp: 986, hpUnit: 'T', damage: 9.86, damageUnit: 'T', type: '근접' },
  { stage: 92, hp: 987, hpUnit: 'T', damage: 9.87, damageUnit: 'T', type: '근접' },
  { stage: 93, hp: 988, hpUnit: 'T', damage: 9.88, damageUnit: 'T', type: '근접' },
  { stage: 94, hp: 989, hpUnit: 'T', damage: 9.89, damageUnit: 'T', type: '근접' },
  { stage: 95, hp: 792, hpUnit: 'T', damage: 6.93, damageUnit: 'T', type: '원거리' },
  { stage: 96, hp: 792, hpUnit: 'T', damage: 6.93, damageUnit: 'T', type: '원거리' },
  { stage: 97, hp: 793, hpUnit: 'T', damage: 6.94, damageUnit: 'T', type: '원거리' },
  { stage: 98, hp: 794, hpUnit: 'T', damage: 6.94, damageUnit: 'T', type: '원거리' },
  { stage: 99, hp: 794, hpUnit: 'T', damage: 6.95, damageUnit: 'T', type: '원거리' },
  { stage: 100, hp: 1.05, hpUnit: 'P', damage: 9.18, damageUnit: 'T', type: '원거리' },
];

export const lastUpdated = '2026-03-21';

// 단위 환산: T → 숫자(10^12), P → 10^15
export function bossHpAsNumber(stage: BossStage): number {
  return stage.hp * (stage.hpUnit === 'P' ? 1e15 : 1e12);
}

export function bossDamageAsNumber(stage: BossStage): number {
  return stage.damage * (stage.damageUnit === 'P' ? 1e15 : 1e12);
}

export function getBossStage(stage: number): BossStage | null {
  return BOSS_DESPAIR_14.find((b) => b.stage === stage) ?? null;
}

// 보스 처치 시간 추정 (초)
export function estimateClearTime(bossHp: number, dps: number): number | null {
  if (dps <= 0 || bossHp <= 0) return null;
  return bossHp / dps;
}
