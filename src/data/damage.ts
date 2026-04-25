// 출처: 네이버 게임 라운지 — 데미지편 (YUI, 2026-03-08)
// 공식의 정확도는 ±2~5% 수준의 추정치입니다.

// 공식 요약:
// 평타 = 공격력 × (기본공격피해량 + 일반/보스피해량 + 모든피해량증가 - 2)
// 스킬 = 공격력 × (스킬피해량 + 일반/보스피해량 + 모든피해량증가 - 2) × 스킬계수 × [속성계수]
// 치명타 = 기본데미지 × (1 + 치명타피해량%)
// 방어력 = 없음 (층/보스 무관)

// 단위: 1K=1,000 / 1M=1,000,000 / 1G=1,000,000,000 / 1T=1,000,000,000,000

// 14단계 절망 보스 — 이미지 글로 텍스트 추출 불가, TBD
export const BOSS_DESPAIR_14 = {
  hp: null as number | null,     // TBD
  incomingDmg: null as number | null, // 피격데미지 TBD
};

// 버프 등급별 효과 (버프편, YUI, 2026-03-11)
export const BUFF_GRADES = {
  critRate: { normal: 5, rare: 10, hero: 15, legend: 20, myth: 30 },      // %
  critDmg:  { normal: 10, rare: 20, hero: 30, legend: 40, myth: 50 },     // %
  atkSpeed: { normal: 10, rare: 15, hero: 20, legend: 25, myth: 30 },     // %
};

// 기본 치명타 배수 추정치 (공식 미확인, 일반 모바일 게임 패턴 기반)
// 게임 내 치명타 배수 기본값이 확인되면 이 값 수정 필요
export const DEFAULT_CRIT_BASE_MULTIPLIER = 1.5; // 150% (±미확인)
