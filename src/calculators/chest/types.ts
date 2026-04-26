// ─── 즉시 개봉 가성비 ────────────────────────────────────────────────────
export interface InstantOpenInput {
  chestId: 'slime' | 'normal' | 'rare' | 'hero' | 'legend';
  hasPremium: boolean;        // 광제(광고제거) 보유
  instantDiamond: number;     // 게임 내 표시된 즉시개봉 다이아
  adDiamond: number;          // 광고 시청 후 즉시개봉 다이아 (없으면 -1)
  timeValuePerMin: number;    // 사용자 다이아 시간 가치 (다이아/분)
}

export interface InstantOpenResult {
  effectiveOpenMinutes: number;       // 실효 해제 시간 (광제 반영)
  naturalWaitDiamondCost: number;     // 자연 해제 시 시간 환산 다이아 비용
  instantSavingMinutes: number;       // 즉시 개봉으로 아끼는 분
  instantWorthIt: boolean;            // 즉시 개봉이 이득인가
  adWorthIt: boolean;                 // 광고 후 개봉이 이득인가
  recommendation: string;
}

// ─── 베르누이 EV (N회 개봉 시 목표 1개 이상 획득 확률) ───────────────────
export interface BernoulliInput {
  chestCount: number;          // 보유 상자 (또는 키) 수
  targetProbability: number;   // 1회 개봉 시 목표 보상 획득 확률 (%)
  trials: number;              // 추가 시뮬: 몬테카를로 반복 횟수 (기본 10000)
}

export interface BernoulliResult {
  probAtLeastOne: number;      // 1개 이상 획득 확률 (closed-form 1-(1-p)^n)
  expectedDrops: number;       // 기댓값 (n*p)
  variance: number;            // 분산 (n*p*(1-p))
  stdDev: number;              // 표준편차
  prob0to5: number[];          // P(X=0)~P(X=5)
  monteCarlo: {
    mean: number;              // 시뮬 평균 획득
    p1: number;                // 시뮬 P(X≥1)
    seed: number;
  };
}

export const DEFAULT_INSTANT_INPUT: InstantOpenInput = {
  chestId: 'legend',
  hasPremium: false,
  instantDiamond: 150,
  adDiamond: -1,
  timeValuePerMin: 2,
};

export const DEFAULT_BERNOULLI_INPUT: BernoulliInput = {
  chestCount: 100,
  targetProbability: 5,
  trials: 10000,
};
