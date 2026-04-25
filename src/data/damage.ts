// TBD: 모든 값은 "여고리셋을 좀더 알아보자 - 데미지편" 및 게임 라운지 자료에서 채우기

export const WORLD_STAGES = {
  1: { name: '1단계 (시작)', limit: { atk: 100, hp: 100, recovery: 100 } },
  2: { name: '2단계 (도전)', limit: { atk: 150, hp: 150, recovery: 150 } },
  3: { name: '3단계 (위험)', limit: { atk: 200, hp: 200, recovery: 200 } },
  4: { name: '4단계 (균열)', limit: { atk: 250, hp: 250, recovery: 250 } },
  5: { name: '5단계 (고통)', limit: { atk: 300, hp: 300, recovery: 300 } },
  6: { name: '6단계 (타락)', limit: { atk: 350, hp: 350, recovery: 350 } },
  7: { name: '7단계 (붕괴)', limit: { atk: 400, hp: 400, recovery: 400 } },
  8: { name: '8단계 (공허)', limit: { atk: 450, hp: 450, recovery: 450 } },
  9: { name: '9단계 (금단)', limit: { atk: 500, hp: 500, recovery: 500 } },
  10: { name: '10단계 (파멸)', limit: { atk: 550, hp: 550, recovery: 550 } },
  11: { name: '11단계 (지옥)', limit: { atk: 600, hp: 600, recovery: 600 } },
  12: { name: '12단계 (심연)', limit: { atk: 650, hp: 650, recovery: 650 } },
  13: { name: '13단계 (악몽)', limit: { atk: 700, hp: 700, recovery: 700 } },
  14: { name: '14단계 (절망)', limit: { atk: 750, hp: 750, recovery: 750 } },
} satisfies Record<number, { name: string; limit: Record<string, number> }>;

// TBD: 14단계 절망 보스 스펙
export const BOSS_14_DESPAIR = {
  hp: 10000000,              // TBD: 실제 보스 체력
  defense: 5000,             // TBD: 방어력
  damageReduction: 0.5,      // TBD: 피격 데미지 감소율 (예: 50%)
};

// TBD: 기본 버프 효과 (올버프 단계별)
export const ALL_BUFF_STAGES = {
  0: { atkMul: 1.0, critRateMul: 1.0, recoveryMul: 1.0 },
  1: { atkMul: 1.1, critRateMul: 1.05, recoveryMul: 1.1 },
  2: { atkMul: 1.2, critRateMul: 1.1, recoveryMul: 1.2 },
  3: { atkMul: 1.3, critRateMul: 1.15, recoveryMul: 1.3 },
  4: { atkMul: 1.4, critRateMul: 1.2, recoveryMul: 1.4 },
  5: { atkMul: 1.5, critRateMul: 1.25, recoveryMul: 1.5 },
} satisfies Record<number, Record<string, number>>;

// TBD: 스킬 기본 정보 (계수는 사용자가 직접 입력하는 모드 A이므로 여기선 심플)
export const SKILL_TEMPLATES = [
  { id: 'skill_1', name: '스킬 1', defaultCooldown: 2.0 },
  { id: 'skill_2', name: '스킬 2', defaultCooldown: 3.0 },
  { id: 'skill_3', name: '스킬 3', defaultCooldown: 4.0 },
] as const;

// TBD: 카드 효과 분류 (사용자 커스텀 데이터 우선)
export const CARD_TYPES = ['dmg', 'atk', 'critRate', 'goldGain', 'other'] as const;
