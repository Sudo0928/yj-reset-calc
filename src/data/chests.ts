// 출처: 상자편 (YUI, 2026-03-08), 등반 상자 심화 꿀팁 (모룸, 2026-03-06)
// 상자 5종의 보상 풀과 확률은 게임 내 이미지 표 → 텍스트 추출 불가 → 사용자 직접 입력

export interface ChestType {
  id: 'slime' | 'normal' | 'rare' | 'hero' | 'legend';
  name: string;
  openMinutes: number;       // 자연 해제 시간 (분)
  instantDiamond: number | null; // 즉시 개봉 다이아 (확인된 값만)
  adDiscountDiamond: number | null; // 광고 시청 후 즉시 개봉 (확인된 값만)
  color: string;             // 상자 표기 색상
}

export const CHEST_TYPES: ChestType[] = [
  { id: 'slime',  name: '슬라임상자', openMinutes: 60,  instantDiamond: null, adDiscountDiamond: null, color: '#A8DADC' },
  { id: 'normal', name: '일반상자',   openMinutes: 5,   instantDiamond: 20,   adDiscountDiamond: 0,    color: '#B6E2B6' },
  { id: 'rare',   name: '희귀상자',   openMinutes: 40,  instantDiamond: null, adDiscountDiamond: 18,   color: '#A8DADC' },
  { id: 'hero',   name: '영웅상자',   openMinutes: 240, instantDiamond: null, adDiscountDiamond: null, color: '#D4A5E5' },
  { id: 'legend', name: '전설상자',   openMinutes: 720, instantDiamond: 150,  adDiscountDiamond: null, color: '#FFD700' },
];

// 광제(광고제거) 효과: 30분 단축
export const PREMIUM_TIME_REDUCTION_MINUTES = 30;

// 다이아 시간 가치 (참고용): 1분 = 2다이아 (연구/상자 시간단축 기준)
export const DIAMOND_PER_MINUTE = 2;
