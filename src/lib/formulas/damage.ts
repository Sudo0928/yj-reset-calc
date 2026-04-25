/**
 * 데미지 계산 공식 (모드 A: 직접 수치 입력)
 * TBD: MHTML 자료 "데미지편"에서 정확한 공식·순서 정의 필요
 */

export interface DamageInput {
  // 기본 스탯
  atk: number;
  critRate: number;        // 0~1 범위
  critDmg: number;         // 배수 (1.5 = 150%)
  skillDmgMul: number;     // 스킬 데미지 % (1.2 = 120%)
  additionalDmgMul: number; // 추가 데미지 % (1.1 = 110%)
  penetration: number;     // 관통 (고정값)

  // 스킬
  skillCoeff: number;      // 스킬 계수
  skillCooldown: number;   // 쿨다운(초)

  // 버프
  allBuffStage: number;    // 0~5
  temporaryBuffMul: number; // 임시 버프 배수

  // 장비/코스튬 추가 스탯
  equipAtkBonus: number;
  equipCritBonus: number;
  costumeAtkBonus: number;

  // 동료 특성 보너스
  companionAtkBonus: number;
  companionCritDmgBonus: number;

  // 카드 효과 (다중)
  cardDmgBonus: number;
  cardAtkBonus: number;
  cardCritBonus: number;

  // 적/환경
  enemyDefense: number;
  stageDamageReduction: number; // 월드 제한 피격 데미지 감소
  isBoss: boolean;
}

export interface DamageOutput {
  baseDamage: number;      // 공식 적용 전 순 데미지
  avgDamage: number;       // 평균 (치명타 고려)
  minDamage: number;       // 비치명 데미지
  maxDamage: number;       // 치명 데미지
  dps: number;             // 1초당 데미지
  boss14ClearTime: number; // 14단계 절망 보스 처치 시간(초)
}

/**
 * TBD: 정확한 공식으로 대체
 *
 * 현재 단순화 공식:
 * baseDmg = (atk + equipAtk + costumeAtk + companionAtk + cardAtk) * skillCoeff
 * buffDmg = baseDmg * (올버프배수) * (스킬데미지%) * (추가데미지%) * (임시버프) * (카드보너스)
 * 방어력감산 = max(1, buffDmg - enemyDefense)
 * avgDmg = 방어력감산 * (1 + critRate * (critDmg - 1))
 * DPS = avgDmg / skillCooldown
 */
export function calculateDamage(input: DamageInput): DamageOutput {
  // 1. 총 공격력 계산
  const totalAtk =
    input.atk +
    input.equipAtkBonus +
    input.costumeAtkBonus +
    input.companionAtkBonus +
    input.cardAtkBonus;

  // 2. 기본 데미지 (스킬 계수 적용)
  let baseDmg = totalAtk * input.skillCoeff;

  // 3. 올버프 배수 (TBD: 실제 올버프 테이블로 대체)
  const buffMul = 1.0 + input.allBuffStage * 0.1; // placeholder

  // 4. 스킬/추가/임시 버프 적용
  baseDmg *= buffMul;
  baseDmg *= input.skillDmgMul;
  baseDmg *= input.additionalDmgMul;
  baseDmg *= input.temporaryBuffMul;
  baseDmg *= 1 + input.cardDmgBonus / 100;

  // 5. 총 치명타율·치명타 데미지 (카드 포함)
  const totalCritRate = Math.min(1, input.critRate + input.cardCritBonus / 100);
  const totalCritDmg = input.critDmg + input.companionCritDmgBonus;

  // 6. 방어력 감산 (TBD: 정확한 공식)
  const afterDefense = Math.max(1, baseDmg - input.enemyDefense * 0.5);

  // 7. 월드 제한 피격 감소
  let afterStageLimit = afterDefense;
  if (input.stageDamageReduction > 0) {
    afterStageLimit *= 1 - input.stageDamageReduction;
  }

  // 8. 치명타 계산
  const minDamage = afterStageLimit * (1 - totalCritRate);
  const maxDamage = afterStageLimit * totalCritDmg;
  const avgDamage = minDamage * (1 - totalCritRate) + maxDamage * totalCritRate;

  // 9. DPS
  const dps = avgDamage / input.skillCooldown;

  // 10. 14단계 절망 보스 처치 시간 (TBD: 실제 보스 스펙)
  const boss14Hp = 10000000; // placeholder
  const boss14ClearTime = boss14Hp / Math.max(1, dps);

  return {
    baseDamage: afterDefense,
    avgDamage: Math.round(avgDamage * 10) / 10,
    minDamage: Math.round(minDamage * 10) / 10,
    maxDamage: Math.round(maxDamage * 10) / 10,
    dps: Math.round(dps * 10) / 10,
    boss14ClearTime: Math.round(boss14ClearTime * 10) / 10,
  };
}

/**
 * Sensitivity 분석: 각 입력을 10% 올렸을 때 DPS 변화
 */
export function calculateSensitivity(
  input: DamageInput,
  baseOutput: DamageOutput,
): Record<string, number> {
  const delta = 0.1; // 10% 변화
  const sensitivity: Record<string, number> = {};

  const fields: (keyof DamageInput)[] = [
    'atk',
    'critRate',
    'critDmg',
    'skillDmgMul',
    'additionalDmgMul',
    'skillCoeff',
    'allBuffStage',
    'equipAtkBonus',
  ];

  for (const field of fields) {
    const modifiedInput = { ...input };
    const original = modifiedInput[field] as number;
    modifiedInput[field] = (original * (1 + delta)) as never;

    const output = calculateDamage(modifiedInput);
    const dpsChange = (output.dps - baseOutput.dps) / baseOutput.dps;
    sensitivity[field] = Math.round(dpsChange * 1000) / 10; // % 단위
  }

  return sensitivity;
}
