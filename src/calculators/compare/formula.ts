// 빌드 비교 — 두 BuildSnapshot 차이 + 민감도 top 5

import { calcDps, calcSurvival } from '@/calculators/dps/formula';
import { calcHourly } from '@/calculators/hourly/formula';
import { STAT_FIELDS, type StatsFlat } from '@/data/statsSchema';
import type { CompareInput, CompareResult, SensitivityItem } from './types';

const EFFECT_KEYS = ['allDmgInc', 'goldAcq', 'totalGoldAcq', 'lightShardAcq', 'researchTimeRed', 'idleRewardTime'] as const;

const EFFECT_LABELS: Record<string, string> = {
  allDmgInc: '모든 피해량 증가',
  goldAcq: '골드 획득량',
  totalGoldAcq: '전체 골드 획득량',
  lightShardAcq: '빛파편 획득량',
  researchTimeRed: '연구시간 감소',
  idleRewardTime: '방치보상 시간',
};

function calcGoldHourly(stats: StatsFlat, env: CompareInput['left']['env'], hoursPerDay: number) {
  const r = calcHourly({ stats, env, mode: 'measured', hoursPerDay });
  return r.goldPerHour;
}

export function calcCompare(input: CompareInput): CompareResult {
  const { left, right, hoursPerDay } = input;

  const leftDps = calcDps(left.stats, left.env);
  const rightDps = calcDps(right.stats, right.env);
  const dpsDiff = rightDps.total - leftDps.total;
  const dpsDiffPct = leftDps.total > 0 ? (dpsDiff / leftDps.total) * 100 : 0;

  const leftGoldHr = calcGoldHourly(left.stats, left.env, hoursPerDay);
  const rightGoldHr = calcGoldHourly(right.stats, right.env, hoursPerDay);
  const goldHrDiff = rightGoldHr - leftGoldHr;
  const goldHrDiffPct = leftGoldHr > 0 ? (goldHrDiff / leftGoldHr) * 100 : 0;

  const leftSurv = calcSurvival(left.stats);
  const rightSurv = calcSurvival(right.stats);
  const hpDiff = rightSurv.effectiveHp - leftSurv.effectiveHp;
  const hpDiffPct = leftSurv.effectiveHp > 0 ? (hpDiff / leftSurv.effectiveHp) * 100 : 0;

  const effectDiffs = EFFECT_KEYS.map((k) => {
    const l = left.stats[k] ?? 0;
    const r = right.stats[k] ?? 0;
    return { key: k, label: EFFECT_LABELS[k] ?? k, left: l, right: r, diff: r - l };
  });

  // ─── 민감도 top 5 (좌 빌드 기준 각 필드 +1% 변화) ────────
  const baseDps = leftDps.total;
  const baseGold = leftGoldHr;
  const items: SensitivityItem[] = STAT_FIELDS.map((f) => {
    const baseVal = left.stats[f.key] ?? 0;
    if (baseVal === 0) return { key: f.key, label: f.label, dpsDeltaPct: 0, goldDeltaPct: 0 };

    const modifiedStats = { ...left.stats, [f.key]: baseVal * 1.01 };
    const modDps = calcDps(modifiedStats, left.env).total;
    const modGold = calcGoldHourly(modifiedStats, left.env, hoursPerDay);

    return {
      key: f.key,
      label: f.label,
      dpsDeltaPct: baseDps > 0 ? ((modDps - baseDps) / baseDps) * 100 : 0,
      goldDeltaPct: baseGold > 0 ? ((modGold - baseGold) / baseGold) * 100 : 0,
    };
  });

  // 정렬: max(dps, gold) 변화율 내림차순
  const sensitivityTop5 = items
    .filter((it) => it.dpsDeltaPct > 0 || it.goldDeltaPct > 0)
    .sort((a, b) => Math.max(b.dpsDeltaPct, b.goldDeltaPct) - Math.max(a.dpsDeltaPct, a.goldDeltaPct))
    .slice(0, 5);

  return {
    leftDps, rightDps, dpsDiff, dpsDiffPct,
    leftGoldHr, rightGoldHr, goldHrDiff, goldHrDiffPct,
    leftHp: leftSurv.effectiveHp, rightHp: rightSurv.effectiveHp, hpDiff, hpDiffPct,
    effectDiffs,
    sensitivityTop5,
  };
}
