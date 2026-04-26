// 출처: 네이버 게임 라운지 — 골드획득上/下편 (YUI, 2026-04-18/20)
// 출처: 빛의 파편 수급편 (YUI, 2026-03-04) / 슬라임 합성보상편 (YUI, 2026-03-12)

// 골드 계산 공식:
// 획득 골드 = floor(floor(기본값 × 골획%) × 전골획%)
// 중간중간 버림(floor) 필수

// 확인된 스테이지별 기본값 (기본값 = 골획/전골획 100%일때 골드 1개 드랍량)
// 5-12 기준 91, 1-1 기준 10, 13단계 약 250 추정 (신뢰도 낮음)
export const GOLD_BASE_VALUES: Record<string, number> = {
  '1-1': 10,
  '5-12': 91,
  // 다른 스테이지는 미확인 (TBD)
};

// 몬스터 골드 드랍율
export const MONSTER_GOLD_DROP_RATE = 0.7; // 약 70% 추정

// 웨이브당 몬스터 수
export const WAVE_MONSTER_COUNT = {
  climb: [10, 15, 20, 25] as const, // 등반모드 1~4웨이브
  infinite: [25, 25, 25, 25] as const, // 무한모드
};

// 신화 골획 버프 효과
export const GOLD_BUFF_MYTH_BONUS = 30; // +30%

// 빛의 파편 — 슬라임 레벨별 획득량: n레벨 → n²개
export function lightShardBySlimeLevel(level: number): number {
  return level * level;
}

// 빛의파편 획득량 배율
export const LIGHT_SHARD_MULTIPLIER = {
  base: 1.0,
  research: 1.3,     // 연구소 '빛의 파편 획득량 증가' 2개 완료 (+30%, 추정치)
  masterPack: 2.0,   // 슬라임 마스터 팩 구매 시
  researchAndPack: 2.6, // 둘 다 적용
};

// 달빛 충전
export const MOONLIGHT = {
  diamondPerCharge: 300,  // 달빛 1회 충전 = 300 다이아
  moonlightPerCharge: 100, // 1회 충전 = 100 달빛
  slimePerMoonlight: 1,   // 1달빛 = 슬라임 1마리

  // 합성보상: 매주 초기화, 50회 합성마다 1회 보상
  // 보상 종류 4개: 다이아50 / 장비뽑기권3 / 스킬뽑기권3 / 동료뽑기권3 순환
  // 뽑기권 1개 평균 가치: (80 + 720/10) / 2 = 76 다이아
  synthesisPerReward: 50,
  rewardTypes: 4,
  rewardDiamond: 50,
  rewardTickets: 3, // 뽑기권 3개 (장비/스킬/동료 중 1종)
  ticketValueDiamond: 76, // 뽑기권 1개 = 76 다이아 (평균)
};

// 재화 환율 (다이아 기준)
export const EXCHANGE_RATE = {
  summonTicket: 76,   // 뽑기권 1개 (평균: 80다이아 단품, 72다이아 10연)
  moonlightPerDiamond: 1 / 3, // 1달빛 = 3다이아 (300다이아=100달빛)
};
