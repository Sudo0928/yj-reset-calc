// 출처: 사용자 제공 — 인게임 스펙창에 표기되는 33개 필드 + 환경
// 모든 % 필드는 게임 표기 그대로 입력 (100% = ×1.0)
// 모든 큰 수치는 parseGameNumber("247.2G") 형태로 받음

export type StatGroup = 'girl' | 'drone' | 'companion' | 'effect';

export interface StatFieldDef {
  key: string;
  label: string;
  group: StatGroup;
  suffix?: string;       // '%' 또는 '초' 등
  isLargeNumber?: boolean; // K/M/G/T 단위 입력 가능
  defaultValue: number;
  hint?: string;
}

export const STAT_FIELDS: StatFieldDef[] = [
  // ─── 여고생 (14) ──────────────────────────────────────────
  { key: 'attack',           group: 'girl', label: '공격력',           isLargeNumber: true,  defaultValue: 0,  hint: '인게임 스펙창 → 공격력 (예: 247.2G)' },
  { key: 'attackSpeed',      group: 'girl', label: '공격속도',         suffix: '회/초',      defaultValue: 1,  hint: '초당 평타 횟수' },
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
  // 'totalRecoveryInc'는 14번째이지만 여고생 그룹 마지막
  // (전체 생명력 증가 다음에 전체 회복력 증가)

  // ─── 드론 (5) ─────────────────────────────────────────────
  { key: 'droneAttack',         group: 'drone', label: '드론 공격력',         isLargeNumber: true, defaultValue: 0 },
  { key: 'droneCritRate',       group: 'drone', label: '드론 치명타 확률',    suffix: '%',         defaultValue: 0 },
  { key: 'droneCritDmg',        group: 'drone', label: '드론 치명타 피해량',  suffix: '%',         defaultValue: 0 },
  { key: 'droneNormalMonDmg',   group: 'drone', label: '드론 일반 몬스터 피해량', suffix: '%',     defaultValue: 0 },
  { key: 'droneBossMonDmg',     group: 'drone', label: '드론 보스 몬스터 피해량', suffix: '%',     defaultValue: 0 },

  // ─── 동료 (8) ─────────────────────────────────────────────
  { key: 'compAttack',         group: 'companion', label: '동료 공격력',         isLargeNumber: true, defaultValue: 0 },
  { key: 'compAttackSpeed',    group: 'companion', label: '동료 공격속도',       suffix: '회/초',     defaultValue: 1 },
  { key: 'compDmg',            group: 'companion', label: '동료 피해량',         suffix: '%',         defaultValue: 100 },
  { key: 'compDoubleShot',     group: 'companion', label: '동료 더블샷 확률',    suffix: '%',         defaultValue: 0 },
  { key: 'compCritRate',       group: 'companion', label: '동료 치명타 확률',    suffix: '%',         defaultValue: 0 },
  { key: 'compCritDmg',        group: 'companion', label: '동료 치명타 피해량',  suffix: '%',         defaultValue: 0 },
  { key: 'compNormalMonDmg',   group: 'companion', label: '동료 일반 몬스터 피해량', suffix: '%',     defaultValue: 0 },
  { key: 'compBossMonDmg',     group: 'companion', label: '동료 보스 몬스터 피해량', suffix: '%',     defaultValue: 0 },

  // ─── 효과 (6) ─────────────────────────────────────────────
  { key: 'allDmgInc',         group: 'effect', label: '모든 피해량 증가',  suffix: '%', defaultValue: 100 },
  { key: 'goldAcq',           group: 'effect', label: '골드 획득량',       suffix: '%', defaultValue: 100 },
  { key: 'totalGoldAcq',      group: 'effect', label: '전체 골드 획득량',  suffix: '%', defaultValue: 100 },
  { key: 'lightShardAcq',     group: 'effect', label: '빛의파편 획득량 증가', suffix: '%', defaultValue: 0 },
  { key: 'researchTimeRed',   group: 'effect', label: '연구 시간 감소',    suffix: '%', defaultValue: 0 },
  { key: 'idleRewardTime',    group: 'effect', label: '방치 보상 시간',    suffix: '%', defaultValue: 100 },
];

// 14번째 여고생 필드 (전체 회복력 증가) 누락 보완
STAT_FIELDS.splice(
  STAT_FIELDS.findIndex((f) => f.key === 'totalHpInc') + 1,
  0,
  { key: 'totalRecoveryInc', group: 'girl', label: '전체 회복력 증가', suffix: '%', defaultValue: 0 },
);

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
