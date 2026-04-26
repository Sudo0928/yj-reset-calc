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
// 빛파편 7개당 1단계 강화
export const LEVELUP_PER_SHARDS = 7;

export interface LevelUpGain {
  attackPct: number;   // 공격력 % 증가 (1단계 기준)
  hpPct: number;       // 생명력 % 증가
}

export const LEVELUP_GAIN_BY_GRADE: Record<'R' | 'SR' | 'SSR', LevelUpGain> = {
  R:   { attackPct: 0.2, hpPct: 0.7 },
  SR:  { attackPct: 0.3, hpPct: 0.9 },
  SSR: { attackPct: 0.4, hpPct: 1.2 },
};

// 코스튬 마스터 — 보유한 코스튬 수 누적 1~200 단계
// 단계당 모든 피해량 증가 (Lv1 = +1%, 단계마다 추가 효과 추정)
export const COSTUME_MASTER_MAX = 200;
export const COSTUME_MASTER_LV1_EFFECT = '모든 피해량 증가 +1%';

// 최대 레벨
export const COSTUME_MAX_LEVEL = 100;

// 1회 강화 비용 (이미지에서 R등급 Lv1 → 다이아? 8개 확인 — 정확한 단위 미확인)
// → 빛파편 단위로 통일하여 LEVELUP_PER_SHARDS 사용

export const lastUpdated = '2026-03-01';
