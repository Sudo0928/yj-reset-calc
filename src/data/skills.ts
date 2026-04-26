// 출처: 라운지 스킬편 (YUI, 2026-03-06) + Phase 12.2 이미지 분석 (냉동 큐브)

export interface SkillMeta {
  id: string;
  name: string;
  grade: '일반' | '희귀' | '영웅' | '전설' | '신화';
  damagePct: number;        // 기본 피해량 % (예: 냉동큐브 606.1)
  cooldownSec: number;      // 쿨다운 (초)
  effect?: string;          // 추가 효과 텍스트
  ownEffect?: string;       // 보유 효과 (스킬 보유 시 글로벌 효과)
}

// 이미지 분석 (스킬편 005): 냉동 큐브 (희귀, Lv2)
// "냉동 큐브를 던져 606.1% 피해를 주고 1.5초간 빙결시킵니다." 6초 쿨다운
// 보유 효과: 스킬 피해량 +0.8%
export const SKILL_HINTS: SkillMeta[] = [
  {
    id: 'frozen-cube',
    name: '냉동 큐브',
    grade: '희귀',
    damagePct: 606.1,
    cooldownSec: 6,
    effect: '1.5초간 빙결',
    ownEffect: '스킬 피해량 +0.8%',
  },
  // 다른 스킬은 텍스트 데이터에서 추정만 가능. 사용자 입력으로 보강.
];

// 스킬 레벨업 효과 — 텍스트 추출
// 일반~영웅: 레벨당 피해량 +1%
// 전설+: 레벨당 피해량 +2%
export const LEVELUP_DAMAGE_PCT_BY_GRADE: Record<SkillMeta['grade'], number> = {
  일반: 1,
  희귀: 1,
  영웅: 1,
  전설: 2,
  신화: 2,
};

// 스킬 등급별 보유 효과 (스킬 피해량 글로벌 보너스)
// 이미지: 희귀 1종 보유 → 스킬 피해량 +0.8%. 등급/수에 따라 비례 추정.
export const SKILL_OWN_BONUS_PCT_PER = {
  일반: 0.4,
  희귀: 0.8,
  영웅: 1.2,
  전설: 1.6,
  신화: 2.0,
};

// 스킬 속성 6종 (텍스트 추출)
export const SKILL_ATTRIBUTES = ['빙결', '화염', '번개', '독', '회복', '빛'] as const;

export const lastUpdated = '2026-03-06';
