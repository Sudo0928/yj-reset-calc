// 출처: 사용자 제공 — 인게임 스펙창에 표기되는 33개 필드 + 환경
// 모든 % 필드는 게임 표기 그대로 입력 (100% = ×1.0)
// 모든 큰 수치는 parseGameNumber("247.2G") 형태로 받음

export type StatGroup = 'girl' | 'drone' | 'companion' | 'effect';

export interface StatFieldDef {
  key: string;
  label: string;
  group: StatGroup;
  suffix?: string;       // '%', '시간', '회/초' 등
  isLargeNumber?: boolean; // 사용자 안내용 (예: 공격력 247.2G). 단, 모든 필드는 parseGameNumber로 K/M/G/T 입력 가능
  defaultValue: number;
  hint?: string;
}

export const STAT_FIELDS: StatFieldDef[] = [
  // ─── 여고생 (14) ──────────────────────────────────────────
  { key: 'attack',           group: 'girl', label: '공격력',           isLargeNumber: true,  defaultValue: 0,  hint: '인게임 스펙창 → 공격력 (예: 247.2G)' },
  { key: 'attackSpeed',      group: 'girl', label: '공격속도',         suffix: '%',          defaultValue: 100, hint: '인게임 표기 % (100% = 기본 속도)' },
  { key: 'moveSpeed',        group: 'girl', label: '이동속도',         suffix: '%',          defaultValue: 100, hint: '100% = 기본' },
  { key: 'evasion',          group: 'girl', label: '회피율',           suffix: '%',          defaultValue: 0 },
  { key: 'normalAttackDmg',  group: 'girl', label: '기본 공격 피해량', suffix: '%',          defaultValue: 100, hint: '100% = ×1.0' },
  { key: 'skillDmg',         group: 'girl', label: '스킬 피해량',      suffix: '%',          defaultValue: 100 },
  { key: 'skillCooldownRed', group: 'girl', label: '스킬 쿨타임 감소', suffix: '%',          defaultValue: 0 },
  { key: 'critRate',         group: 'girl', label: '치명타 확률',      suffix: '%',          defaultValue: 0,  hint: '버프로만 획득. 신화 +30%' },
  { key: 'critDmg',          group: 'girl', label: '치명타 피해량',    suffix: '%',          defaultValue: 50, hint: '기본 50% (버프 추가시 합산)' },
  { key: 'normalMonsterDmg', group: 'girl', label: '일반 몬스터 피해량', suffix: '%',        defaultValue: 100 },
  { key: 'bossMonsterDmg',   group: 'girl', label: '보스 몬스터 피해량', suffix: '%',        defaultValue: 100 },
  { key: 'hp',               group: 'girl', label: '생명력',           isLargeNumber: true,  defaultValue: 0 },
  { key: 'recovery',         group: 'girl', label: '회복력',           isLargeNumber: true,  defaultValue: 0,  hint: '0.5초당 자가 회복량' },
  { key: 'totalHpInc',       group: 'girl', label: '전체 생명력 증가', suffix: '%',          defaultValue: 0 },
  { key: 'totalRecoveryInc', group: 'girl', label: '전체 회복력 증가', suffix: '%',          defaultValue: 0 },

  // ─── 드론 (5) ─────────────────────────────────────────────
  { key: 'droneAttack',         group: 'drone', label: '드론 공격력',         suffix: '%',         defaultValue: 0,  hint: '여고생 공격력 대비 % (인게임 표기 그대로)' },
  { key: 'droneCritRate',       group: 'drone', label: '드론 치명타 확률',    suffix: '%',         defaultValue: 0 },
  { key: 'droneCritDmg',        group: 'drone', label: '드론 치명타 피해량',  suffix: '%',         defaultValue: 0 },
  { key: 'droneNormalMonDmg',   group: 'drone', label: '드론 일반 몬스터 피해량', suffix: '%',     defaultValue: 0 },
  { key: 'droneBossMonDmg',     group: 'drone', label: '드론 보스 몬스터 피해량', suffix: '%',     defaultValue: 0 },

  // ─── 동료 (8) ─────────────────────────────────────────────
  { key: 'compAttack',         group: 'companion', label: '동료 공격력',         suffix: '%',         defaultValue: 0,   hint: '동료별 능력치 % (예: +266%)' },
  { key: 'compAttackSpeed',    group: 'companion', label: '동료 공격속도',       suffix: '%',         defaultValue: 100, hint: '인게임 표기 % (100% = 기본)' },
  { key: 'compDmg',            group: 'companion', label: '동료 피해량',         suffix: '%',         defaultValue: 100 },
  { key: 'compDoubleShot',     group: 'companion', label: '동료 더블샷 확률',    suffix: '%',         defaultValue: 0 },
  { key: 'compCritRate',       group: 'companion', label: '동료 치명타 확률',    suffix: '%',         defaultValue: 0,   hint: '동료별 능력치 %' },
  { key: 'compCritDmg',        group: 'companion', label: '동료 치명타 피해량',  suffix: '%',         defaultValue: 0,   hint: '동료별 능력치 %' },
  { key: 'compNormalMonDmg',   group: 'companion', label: '동료 일반 몬스터 피해량', suffix: '%',     defaultValue: 0 },
  { key: 'compBossMonDmg',     group: 'companion', label: '동료 보스 몬스터 피해량', suffix: '%',     defaultValue: 0 },

  // ─── 효과 (6) ─────────────────────────────────────────────
  { key: 'allDmgInc',         group: 'effect', label: '모든 피해량 증가',  suffix: '%',  defaultValue: 100 },
  { key: 'goldAcq',           group: 'effect', label: '골드 획득량',       suffix: '%',  defaultValue: 100 },
  { key: 'totalGoldAcq',      group: 'effect', label: '전체 골드 획득량',  suffix: '%',  defaultValue: 100 },
  { key: 'lightShardAcq',     group: 'effect', label: '빛의파편 획득량 증가', suffix: '%', defaultValue: 0 },
  { key: 'researchTimeRed',   group: 'effect', label: '연구 시간 감소',    suffix: '%',  defaultValue: 0 },
  { key: 'idleRewardTime',    group: 'effect', label: '방치 보상 시간',    suffix: '시간', defaultValue: 24, hint: '하루 받을 수 있는 방치 보상 시간 (24 = 풀방치)' },
];

export type StatKey = typeof STAT_FIELDS[number]['key'];

// 그룹별 필드 분리
export function fieldsByGroup(group: StatGroup): StatFieldDef[] {
  return STAT_FIELDS.filter((f) => f.group === group);
}

export const GROUP_LABELS: Record<StatGroup, string> = {
  girl: '여고생',
  drone: '드론',
  companion: '동료',
  effect: '효과',
};

// 환경 입력 (스펙창 외 별도)
export interface EnvInput {
  worldStage: number;       // 1~20
  isBoss: boolean;
  killsPerMin: number;      // 분당 처치수 (사용자 측정)
  measuredGoldPerMin: number; // 측정값 모드용 분당 골드
  goldPerKill: number;      // DPS 모드용 몹 1마리당 골드
  slimeMasterPack: boolean; // 슬마팩 활성화 여부
  slimeAvgLevel: number;    // 슬라임 평균 합성 레벨
  hasResearchBonus: boolean; // 연구소 빛파편+30%
}

export const DEFAULT_ENV: EnvInput = {
  worldStage: 13,
  isBoss: false,
  killsPerMin: 150,
  measuredGoldPerMin: 0,
  goldPerKill: 0,
  slimeMasterPack: false,
  slimeAvgLevel: 10,
  hasResearchBonus: false,
};

// 33필드 평탄 객체 타입
export type StatsFlat = Record<string, number>;

export const DEFAULT_STATS: StatsFlat = Object.fromEntries(
  STAT_FIELDS.map((f) => [f.key, f.defaultValue]),
);

// ─── 추정치 가정 (사용자 보정 가능) ──────────────────────────────────
// 게임 비공개 수치이므로 사용자가 본인 검증값으로 보정할 수 있도록 노출.
// 모든 계산기는 이 객체를 옵셔널로 받고, 미지정 시 DEFAULT_ASSUMPTIONS 사용.
export interface AssumptionsInput {
  critBaseMultiplier: number;          // 여고생 치명타 기본 배수 (기본 1.5)
  droneCritBaseMultiplier: number;     // 드론 치명타 기본 배수 (기본 1.5)
  companionCritBaseMultiplier: number; // 동료 치명타 기본 배수 (기본 1.5)
  skillVsNormalRatio: number;          // DPS 평타:스킬 비중 (0~1, 기본 0.5 = 50:50)
  slimeSynthPerHour: number;           // 시간당 슬라임 합성 횟수 (기본 4)
  premiumDailySavedMin: number;        // 광고제거 일일 시간 절약 분 (기본 120 = 4상자×30분)
  moonlightRoi: number;                // 달빛 충전 다이아 ROI 배수 (기본 1.162)
}

export const DEFAULT_ASSUMPTIONS: AssumptionsInput = {
  critBaseMultiplier: 1.5,
  droneCritBaseMultiplier: 1.5,
  companionCritBaseMultiplier: 1.5,
  skillVsNormalRatio: 0.5,
  slimeSynthPerHour: 4,
  premiumDailySavedMin: 120,
  moonlightRoi: 1.162,
};

// 사용자가 default에서 변경했는지 판정 — 결과 패널에 "추정치 사용 중" 배지 노출용
export function hasCustomAssumptions(a: AssumptionsInput): boolean {
  return (Object.keys(DEFAULT_ASSUMPTIONS) as (keyof AssumptionsInput)[]).some(
    (k) => a[k] !== DEFAULT_ASSUMPTIONS[k],
  );
}

export interface AssumptionFieldDef {
  key: keyof AssumptionsInput;
  label: string;
  hint: string;
  min?: number;
  max?: number;
  step?: number;
}

export const ASSUMPTION_FIELDS: AssumptionFieldDef[] = [
  { key: 'critBaseMultiplier',          label: '치명타 기본 배수 (여고생)', hint: '게임 미확인. 기본 1.5 = 치명타 시 150% 피해. 인게임 표기 확인 시 보정', step: 0.1, min: 1, max: 3 },
  { key: 'droneCritBaseMultiplier',     label: '치명타 기본 배수 (드론)',   hint: '드론용 추정값. 1.5 동일하게 둠', step: 0.1, min: 1, max: 3 },
  { key: 'companionCritBaseMultiplier', label: '치명타 기본 배수 (동료)',   hint: '동료용 추정값', step: 0.1, min: 1, max: 3 },
  { key: 'skillVsNormalRatio',          label: 'DPS 스킬 비중',             hint: '0=평타만, 1=스킬만, 0.5=50:50. 스킬 발동 빈도 추정', step: 0.05, min: 0, max: 1 },
  { key: 'slimeSynthPerHour',           label: '시간당 슬라임 합성 횟수',   hint: '본인 측정값으로 보정. 기본 4회/h', step: 0.5, min: 0 },
  { key: 'premiumDailySavedMin',        label: '광제 일일 절약 시간 (분)',  hint: '하루 평균 상자 N개 × 30분. 본인 사용 패턴 반영', step: 30, min: 0 },
  { key: 'moonlightRoi',                label: '달빛 충전 ROI 배수',        hint: '슬라임 합성보상편 1000회 기준 1.16~1.46배. 새식구 확률 따라 가변', step: 0.01, min: 1, max: 2 },
];
