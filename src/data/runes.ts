// 출처: 라운지 동료특성편 (YUI, 2026-03-15) + Phase 12.2 이미지 분석
// 동료 특성 잠금/룬 소모량 — 등급별 1단계 잠금 해제 비용

export const RUNE_COST_BY_GRADE: Record<string, number> = {
  '일반': 10,
  '희귀': 20,
  '영웅': 30,
  '전설': 40,
  '신화': 50,
};

// 잠금 단계마다 비용 ×배수 (텍스트 추출: "잠금 시 n배 증가")
export const RUNE_LOCK_MULTIPLIER = [1, 2, 3, 4, 5]; // 1단계, 2단계, ...

// 동료 특성 등급별 효과 범위 (확인된 일반 등급 1%부터)
// 이미지 분석: 일반(N) 동료 특성 1 = 골드획득량 +1%
export const TRAIT_EFFECT_HINT = {
  일반: { goldAcq: '+1%', range: '1~2%' },
  희귀: { range: '2~4% 추정' },
  영웅: { range: '4~6% 추정' },
  전설: { range: '6~8% 추정' },
  신화: { range: '8~10% 추정' },
};

export const lastUpdated = '2026-03-15';
