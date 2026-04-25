// 수치 입력: 게임 UI 표기값 그대로 (%는 % 단위로, 공격력은 실수로)
export interface DamageInput {
  // ─── 기본 스텟 ────────────────────────────────────────────
  attack: number;             // 공격력 (실제 표기값, 예: 247.2M → 247200000)
  attackRaw: string;          // 원본 입력 문자열 (표시용)

  // ─── 피해량 계수 (% 단위, 100이 기준=×1) ────────────────
  normalAttackDmg: number;    // 기본 공격 피해량 % (스펙창 표기, 예: 100 → ×1.0)
  skillDmg: number;           // 스킬 피해량 % (예: 790.8)
  normalMonsterDmg: number;   // 일반 몬스터 피해량 %
  bossMonsterDmg: number;     // 보스 몬스터 피해량 %
  allDmgBonus: number;        // 모든 피해량 증가 %

  // ─── 치명타 ──────────────────────────────────────────────
  critRate: number;           // 치명타 확률 % (0~100, 버프로만 획득)
  critDmgBonus: number;       // 치명타 피해량 증가 % (기본 + 버프, 예: 50)

  // ─── 스킬 ────────────────────────────────────────────────
  skillCoeff: number;         // 스킬계수 % (스킬 설명에 표기, 예: 2090 = 2090%)
  attributeCoeff: number;     // 속성 추가데미지 % (0이면 미적용, 예: 30)
  attributeApplied: boolean;  // 속성 조건 충족 여부

  // ─── 공격 속도 ───────────────────────────────────────────
  attacksPerSec: number;      // 초당 평타 횟수 (기본 1)
  skillCooldown: number;      // 스킬 쿨다운 (초)

  // ─── 타겟 환경 ───────────────────────────────────────────
  isBoss: boolean;            // 보스 여부
  worldStage: number;         // 월드 단계 (1~20)

  // ─── 내 스텟 레벨 (월드 제한 비교용) ────────────────────
  currentStatLevel: number;   // 현재 스텟 레벨 (공격력/생명력/회복력 중 대표값)
}

export interface DamageResult {
  // 평타
  normalHit: number;
  normalCrit: number;
  normalExpected: number;     // 기대치 (치명확률 반영)

  // 스킬 (1타)
  skillHit: number;
  skillCrit: number;
  skillExpected: number;

  // DPS (초당 기대 데미지)
  dps: number;

  // 월드
  worldStatLimit: number | null;
  isOverStatLimit: boolean;

  // 민감도 (각 항목 +1% 시 결과 변화율 %)
  sensitivity: SensitivityItem[];
}

export interface SensitivityItem {
  key: string;
  label: string;
  delta: number; // % 변화
}

export const DEFAULT_INPUT: DamageInput = {
  attack: 0,
  attackRaw: '',
  normalAttackDmg: 100,
  skillDmg: 100,
  normalMonsterDmg: 100,
  bossMonsterDmg: 100,
  allDmgBonus: 100,
  critRate: 0,
  critDmgBonus: 50,
  skillCoeff: 100,
  attributeCoeff: 0,
  attributeApplied: false,
  attacksPerSec: 1,
  skillCooldown: 10,
  isBoss: false,
  worldStage: 1,
  currentStatLevel: 0,
};
