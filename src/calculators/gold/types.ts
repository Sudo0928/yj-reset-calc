// ─── 골드 효율 계산기 ───────────────────────────────────────────────────────

export interface GoldInput {
  // 현재 상태 (절전모드 등에서 측정한 값)
  currentGoldPerMin: number; // 현재 분당 골드 획득량 (측정값 직접 입력)

  // 현재 골드 관련 수치 (%)
  goldAcqBonus: number;      // 골드 획득량 증가 % (골획)
  totalGoldBonus: number;    // 전체 골드 획득량 증가 % (전골획)

  // 비교 목표 수치 (%)
  targetGoldAcqBonus: number;
  targetTotalGoldBonus: number;

  // 계산 기준 시간
  hoursPerDay: number;        // 1일 중 실질 사냥 시간 (기본 24)
}

export interface GoldResult {
  // 현재 → 목표 비율 변화
  currentMultiplier: number;    // 현재 골드 배율 (골획% × 전골획%)
  targetMultiplier: number;     // 목표 골드 배율
  changeRatio: number;          // 배율 변화 비율 (목표/현재)
  deltaPercent: number;         // 변화 % (+/-)

  // 현재 획득량
  currentPerMin: number;
  currentPerHour: number;
  currentPerDay: number;
  currentPerWeek: number;

  // 목표 획득량 (예측)
  targetPerMin: number;
  targetPerHour: number;
  targetPerDay: number;
  targetPerWeek: number;
}

// ─── 빛의파편 + 달빛 충전 계산기 ─────────────────────────────────────────

export interface LightShardInput {
  // 슬라임 탄생 예상 레벨 (평균)
  avgSlimeLevel: number;         // 탄생 슬라임 평균 레벨

  // 배율 옵션
  hasResearchBonus: boolean;     // 연구소 빛의파편 증가 연구 완료 여부 (+30%)
  hasMasterPack: boolean;        // 슬라임 마스터 팩 구매 여부 (×2)

  // 달빛 충전
  moonlightCharges: number;      // 이번 주 달빛 충전 횟수
  dailyFreeMoonlight: number;    // 1일 무료 달빛 (기본 150 = 기본50 + 무료충전100)
  moonlightPouchLevel: number;   // 달빛주머니 업그레이드 단계 (0=기본)

  // 새식구 업그레이드
  newMemberRate: number;         // 새식구 확률 % (0이면 미업그레이드)

  // 계산 기준 기간
  days: number;                  // 기간 (기본 7일 = 1주)
}

export interface LightShardResult {
  // 빛의파편
  shardPerSynthesis: number;     // 합성 1회당 파편 기댓값
  multiplier: number;            // 배율
  totalSynth: number;            // 총 합성 횟수 (기간 내)
  totalShards: number;           // 총 파편 획득량

  // 슬라임 소환/합성
  totalMoonlight: number;        // 기간 내 총 달빛
  totalSummons: number;          // 총 소환 횟수
  avgSynthPerSummon: number;     // 소환 1회당 합성 횟수 (new member 반영)

  // 달빛 충전 효율 (다이아 환산)
  diamondInvested: number;       // 투자 다이아 (달빛 충전)
  diamondReturned: number;       // 예상 회수 다이아 (합성보상)
  roi: number;                   // 수익률 (배율)

  // 합성 보상
  rewardCount: number;           // 보상 획득 횟수
  ticketsReturned: number;       // 뽑기권 획득 수
  diamondFromReward: number;     // 다이아 직접 획득
}

export const DEFAULT_GOLD_INPUT: GoldInput = {
  currentGoldPerMin: 0,
  goldAcqBonus: 100,
  totalGoldBonus: 100,
  targetGoldAcqBonus: 130,
  targetTotalGoldBonus: 100,
  hoursPerDay: 24,
};

export const DEFAULT_LIGHT_SHARD_INPUT: LightShardInput = {
  avgSlimeLevel: 10,
  hasResearchBonus: false,
  hasMasterPack: false,
  moonlightCharges: 0,
  dailyFreeMoonlight: 150,
  moonlightPouchLevel: 0,
  newMemberRate: 0,
  days: 7,
};
