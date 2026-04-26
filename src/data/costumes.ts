// 출처: 라운지 코스튬편 (YUI, 2026-02-28 / 26.3.1 일부수정) + 코스튬 뭐부터 (매크니, 2026-03-09)
// + Phase 12.2 이미지 분석

export interface CostumeMeta {
  id: string;
  name: string;
  grade: 'R' | 'SR' | 'SSR';
  stars: 1 | 2 | 3 | 4 | 5;
  ownEffect?: string; // 보유 시 효과 (Lv1 기준)
}

// 이미지 분석 (코스튬편 009/007): 6종 코스튬 + 보유 효과
export const COSTUMES: CostumeMeta[] = [
  { id: 'school',    name: '교복',           grade: 'R',   stars: 3, ownEffect: '공격력 +0.2%, 생명력 +0.6%' },
  { id: 'battle',    name: '배틀슈트',        grade: 'SR',  stars: 4 },
  { id: 'catmaid',   name: '캣메이드',        grade: 'SR',  stars: 4 },
  { id: 'lovely',    name: '러블리스쿨룩',    grade: 'SR',  stars: 4 },
  { id: 'valkyrie',  name: '빛의 발키리',     grade: 'SSR', stars: 5 },
  { id: 'succubus',  name: '레드 서큐버스',   grade: 'SSR', stars: 5 },
];

// 등급별 레벨업 시 스탯 증가 (코스튬 뭐부터 글에서 추출)
export interface LevelUpGain {
  attackPct: number;   // 공격력 % 증가 (1단계 기준)
  hpPct: number;       // 생명력 % 증가
}

export const LEVELUP_GAIN_BY_GRADE: Record<'R' | 'SR' | 'SSR', LevelUpGain> = {
  R:   { attackPct: 0.2, hpPct: 0.7 },
  SR:  { attackPct: 0.3, hpPct: 0.9 },
  SSR: { attackPct: 0.4, hpPct: 1.2 },
};

// 레벨업 비용 공식: f(n, grade) = BASE_INC × (k + 5) × n, k = floor(n / 100)
// SSR 확인값: n=1→15, n=99→1485, n=100→1800, n=101→1818, n=307→7368
// R/SR BASE_INC는 SSR 비례 추정 (미확인)
export const LEVELUP_BASE_INC: Record<'R' | 'SR' | 'SSR', number> = { R: 1, SR: 2, SSR: 3 };
export const BREAKTHROUGH_SIZE = 100; // 100레벨마다 한계 돌파
// SSR 1돌파 에테르 비용 확인, 이후 돌파 및 R/SR는 TBD
export const BREAKTHROUGH_ETHER_COST_SSR_1ST = 50;

/** 레벨 n → n+1 업그레이드 파편 비용 */
export function levelupCost(grade: 'R' | 'SR' | 'SSR', n: number): number {
  const k = Math.floor(n / BREAKTHROUGH_SIZE);
  return LEVELUP_BASE_INC[grade] * (k + 5) * n;
}

/** fromLevel → toLevel 총 파편 비용 */
export function costumeShardCost(grade: 'R' | 'SR' | 'SSR', fromLevel: number, toLevel: number): number {
  let total = 0;
  for (let n = fromLevel; n < toLevel; n++) total += levelupCost(grade, n);
  return total;
}

/** fromLevel → toLevel 구간의 돌파 횟수 */
export function breakthroughCount(fromLevel: number, toLevel: number): number {
  return Math.floor((toLevel - 1) / BREAKTHROUGH_SIZE) - Math.floor(fromLevel / BREAKTHROUGH_SIZE);
}

// 코스튬 마스터 — 보유한 코스튬 수 누적 1~200 단계
export const COSTUME_MASTER_MAX = 200;
export const COSTUME_MASTER_LV1_EFFECT = '모든 피해량 증가 +1%';

// 최대 레벨 (한계 돌파 9회 → 1000레벨)
export const COSTUME_MAX_LEVEL = 1000;

export const lastUpdated = '2026-04-26';
