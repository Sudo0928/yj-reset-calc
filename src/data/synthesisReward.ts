// 출처: 라운지 슬라임 합성보상편 (YUI, 2026-03-12) + 슬라임농장편

// 50회 합성당 1회 보상 — 무한 반복 (50→100→150...)
export const SYNTHESIS_PER_REWARD = 50;

// 보상 4종 순환 (다이아 50 / 장비3 / 스킬3 / 동료3 뽑기권)
export const REWARD_CYCLE = [
  { type: 'diamond', amount: 50 },
  { type: 'equipTicket', amount: 3 },
  { type: 'skillTicket', amount: 3 },
  { type: 'companionTicket', amount: 3 },
] as const;

// 일일 무료 합성 가능 횟수 (텍스트 추출: 일일 최소 146회)
// 달빛 50 (기본) + 50 (무료충전) + 50 (무료충전) = 150 → 합성 146회 (이진수 patient 1 개수만큼 손실)
export const DAILY_FREE_SYNTHESIS = 146;

// 새식구 확률별 합성 횟수·보상 ROI 표 (1000회 충전 기준 = 3000다이아)
// 출처: 빛파편수급편 + 하트 효율표 이미지 분석
export const NEW_MEMBER_ROI_TABLE = [
  { rate: 0,  avgSynth: 994,  rewardCount: 19, diaValue: 3486, ratio: 1.16 },
  { rate: 1,  avgSynth: 1004, rewardCount: 20, diaValue: 3670, ratio: 1.22 },
  { rate: 5,  avgSynth: 1046, rewardCount: 20, diaValue: 3670, ratio: 1.22 },
  { rate: 6,  avgSynth: 1057, rewardCount: 21, diaValue: 3853, ratio: 1.28 },
  { rate: 10, avgSynth: 1104, rewardCount: 22, diaValue: 4037, ratio: 1.34 },
  { rate: 11, avgSynth: 1117, rewardCount: 22, diaValue: 4037, ratio: 1.34 },
  { rate: 12, avgSynth: 1129, rewardCount: 22, diaValue: 4037, ratio: 1.34 },
  { rate: 13, avgSynth: 1143, rewardCount: 22, diaValue: 4037, ratio: 1.34 },
  { rate: 14, avgSynth: 1156, rewardCount: 23, diaValue: 4220, ratio: 1.4 },
  { rate: 15, avgSynth: 1170, rewardCount: 23, diaValue: 4220, ratio: 1.4 },
  { rate: 18, avgSynth: 1212, rewardCount: 24, diaValue: 4404, ratio: 1.46 },
  { rate: 20, avgSynth: 1243, rewardCount: 24, diaValue: 4404, ratio: 1.46 },
];

export const lastUpdated = '2026-03-12';
