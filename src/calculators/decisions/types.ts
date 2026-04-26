// 자원 의사결정 — 다이아 N개 ROI + 신화 버프작 BEP + 재등반 ROI

export interface DiamondAllocationInput {
  diamonds: number;
  goldPerDiamondShop: number; // 다이아 1개 = X 골드 (게임 직구 환율, 사용자 입력)
  premiumDaysPerDiamond: number; // 광제 1일에 필요 다이아 (사용자 입력, 0이면 비활성)
  slimePackDaysPerDiamond: number; // 슬마팩 1일에 필요 다이아 (사용자 입력, 0이면 비활성)
  // 시간 가치 환산용
  goldPerMinMeasured: number; // 사용자 분당 측정 골드 (시간 가치 환산용)
}

export interface AllocationCard {
  id: string;
  label: string;
  amount: number;          // 환산된 양 (골드는 골드, 뽑기권은 개수, 달빛은 합성보상수 등)
  unit: string;            // 'G골드', '뽑기권 개수', '슬라임 N마리', '광제 N일' 등
  diamondPerUnit: number;  // 다이아당 효율 (낮을수록 좋음)
  netDiamondValue: number; // 다이아로 재환산했을 때 가치
  roi: number;             // netDiamondValue / diamonds (1.0이 손익분기)
  note: string;
}

export interface DiamondAllocationResult {
  cards: AllocationCard[];
  bestCardId: string;
}

// ─── 신화 버프작 BEP ────────────────────────────────────
export interface BuffBepInput {
  buffCostDiamond: number;       // 신화 버프 1회(30분) 만드는 데 든 다이아 (체감 비용)
  currentGoldAcq: number;        // 현재 골획%
  goldPerMinMeasured: number;    // 분당 측정 골드 (현재)
  buffDurationMin: number;       // 버프 지속 시간 (신화=30분)
  buffBonusPct: number;          // 버프 효과 % (신화=30%)
}

export interface BuffBepResult {
  finalValueIncreasePct: number; // 골획에 따른 최종값 증가율
  extraGoldDuringBuff: number;   // 버프 30분 동안 추가로 버는 골드
  goldPerDiamondCost: number;    // 다이아당 추가 골드
  bepMinutes: number | null;     // 회수 시간 (다이아→골드 환율 필요시 표시)
  bepSummary: string;
}

// ─── 재등반 ROI 비교 ────────────────────────────────────
export interface ReclimbCandidate {
  id: string;
  label: string;
  goldPerMin: number;
  shardPerHour: number;
  boxesPerHour: number;
}

export interface ReclimbInput {
  candidates: ReclimbCandidate[];
  diamondPerGold: number; // 1골드 = X 다이아 (역환율, 0이면 비활성)
}

export interface ReclimbResult {
  best: ReclimbCandidate | null;
  ranked: Array<ReclimbCandidate & { goldPerHour: number; rank: number }>;
}

export const DEFAULT_DIAMOND_INPUT: DiamondAllocationInput = {
  diamonds: 1000,
  goldPerDiamondShop: 0,     // 사용자 입력 필요 (게임 다이아샵 골드 패키지 환율)
  premiumDaysPerDiamond: 0,
  slimePackDaysPerDiamond: 0,
  goldPerMinMeasured: 0,
};

export const DEFAULT_BUFF_BEP_INPUT: BuffBepInput = {
  buffCostDiamond: 5000,
  currentGoldAcq: 200,
  goldPerMinMeasured: 200_000,
  buffDurationMin: 30,
  buffBonusPct: 30,
};

export const DEFAULT_RECLIMB_INPUT: ReclimbInput = {
  candidates: [
    { id: 'climb-13', label: '13층 등반', goldPerMin: 0, shardPerHour: 0, boxesPerHour: 0 },
    { id: 'idle-100', label: '100층 무한방치', goldPerMin: 0, shardPerHour: 0, boxesPerHour: 0 },
    { id: 'climb-90', label: '90층 등반(상자작)', goldPerMin: 0, shardPerHour: 0, boxesPerHour: 0 },
    { id: 'attempt-14', label: '14층 도전', goldPerMin: 0, shardPerHour: 0, boxesPerHour: 0 },
  ],
  diamondPerGold: 0,
};
