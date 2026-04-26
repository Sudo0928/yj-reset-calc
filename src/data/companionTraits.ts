// 출처: 라운지 동료특성편 (YUI, 2026-03-15) + Phase 12.2 이미지 분석

import { RUNE_COST_BY_GRADE, RUNE_LOCK_MULTIPLIER } from './runes';

export interface CompanionTraitGrade {
  grade: '일반' | '희귀' | '영웅' | '전설' | '신화';
  runeCost: number;       // 1단계 잠금 해제 비용
  expectedEffect: string; // 특성 효과 범위 (이미지·텍스트 종합 추정)
}

export const TRAIT_GRADES: CompanionTraitGrade[] = [
  { grade: '일반', runeCost: RUNE_COST_BY_GRADE.일반!, expectedEffect: '특성 효과 1~2%' },
  { grade: '희귀', runeCost: RUNE_COST_BY_GRADE.희귀!, expectedEffect: '특성 효과 2~4% 추정' },
  { grade: '영웅', runeCost: RUNE_COST_BY_GRADE.영웅!, expectedEffect: '특성 효과 4~6% 추정' },
  { grade: '전설', runeCost: RUNE_COST_BY_GRADE.전설!, expectedEffect: '특성 효과 6~8% 추정' },
  { grade: '신화', runeCost: RUNE_COST_BY_GRADE.신화!, expectedEffect: '특성 효과 8~10% 추정' },
];

// 동료 보유 효과 — 보유한 동료 N명 시 동료 피해량 +X%
// 이미지 분석: 6명 보유 시 동료 피해량 +0.8%, 한 페이지 5×5=25 슬롯 × 5페이지 = 125 슬롯
// 5페이지 시스템 확인. 정확한 수치 패턴은 더 많은 표본 필요.
export const COMPANION_OWN_EFFECT_HINT = {
  perCompanion: 0.13, // 추정: 6명 → 0.8% / 6 ≈ 0.133
  category: '동료 피해량 +%',
  pages: 5,
  slotsPerPage: 25,
  totalSlots: 125,
};

// 룬 잠금 ×배수 (현재까지 1~5단계)
export { RUNE_LOCK_MULTIPLIER };

// 룬 1단계 잠금 해제에 필요한 룬 (잠금 단계 N의 누적 비용)
export function totalRuneCost(grade: CompanionTraitGrade['grade'], lockLevel: number): number {
  if (lockLevel < 1 || lockLevel > RUNE_LOCK_MULTIPLIER.length) return 0;
  const base = RUNE_COST_BY_GRADE[grade] ?? 0;
  // 누적: 1단계=base, 2단계=base+base*2, ...
  let total = 0;
  for (let i = 0; i < lockLevel; i++) {
    total += base * RUNE_LOCK_MULTIPLIER[i]!;
  }
  return total;
}

export const lastUpdated = '2026-03-15';
