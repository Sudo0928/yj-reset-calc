// 출처: 상자편/등반 상자 심화 꿀팁
import { CHEST_TYPES, PREMIUM_TIME_REDUCTION_MINUTES } from '@/data/chests';
import type { InstantOpenInput, InstantOpenResult, BernoulliInput, BernoulliResult } from './types';

// ─── 즉시 개봉 가성비 ─────────────────────────────────────────────────────

export function calcInstantOpen(input: InstantOpenInput): InstantOpenResult {
  const chest = CHEST_TYPES.find((c) => c.id === input.chestId);
  if (!chest) {
    return {
      effectiveOpenMinutes: 0, naturalWaitDiamondCost: 0,
      instantSavingMinutes: 0, instantWorthIt: false, adWorthIt: false,
      recommendation: '상자 종류를 선택하세요',
    };
  }

  const effectiveOpenMinutes = Math.max(
    0, chest.openMinutes - (input.hasPremium ? PREMIUM_TIME_REDUCTION_MINUTES : 0),
  );

  const naturalWaitDiamondCost = effectiveOpenMinutes * input.timeValuePerMin;
  const instantWorthIt = input.instantDiamond > 0 && input.instantDiamond <= naturalWaitDiamondCost;
  const adWorthIt = input.adDiamond >= 0 && input.adDiamond <= naturalWaitDiamondCost;

  let recommendation = '';
  if (input.adDiamond === 0) {
    recommendation = '광고 시청 후 즉시 개봉 (무료)';
  } else if (adWorthIt && (!instantWorthIt || input.adDiamond < input.instantDiamond)) {
    recommendation = `광고 시청 + ${input.adDiamond}다이아 즉시 개봉 추천`;
  } else if (instantWorthIt) {
    recommendation = `즉시 개봉 ${input.instantDiamond}다이아 (시간 가치 ${naturalWaitDiamondCost.toFixed(0)}다이아 < 비용)`;
  } else {
    recommendation = `자연 해제 대기 (${effectiveOpenMinutes}분)`;
  }

  return {
    effectiveOpenMinutes,
    naturalWaitDiamondCost,
    instantSavingMinutes: effectiveOpenMinutes,
    instantWorthIt,
    adWorthIt,
    recommendation,
  };
}

// ─── 베르누이 (closed-form + 몬테카를로 시뮬) ─────────────────────────────

// 이항계수 C(n,k)
function binom(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  let result = 1;
  const m = Math.min(k, n - k);
  for (let i = 0; i < m; i++) {
    result = (result * (n - i)) / (i + 1);
  }
  return result;
}

function binomialProb(n: number, k: number, p: number): number {
  if (p <= 0) return k === 0 ? 1 : 0;
  if (p >= 1) return k === n ? 1 : 0;
  return binom(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
}

// Mulberry32 PRNG (시드 고정 가능)
function mulberry32(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function calcBernoulli(input: BernoulliInput): BernoulliResult {
  const n = Math.max(0, Math.floor(input.chestCount));
  const p = Math.max(0, Math.min(1, input.targetProbability / 100));
  const trials = Math.max(100, Math.floor(input.trials));
  const seed = 42;

  // Closed-form
  const probAtLeastOne = n === 0 ? 0 : 1 - Math.pow(1 - p, n);
  const expectedDrops = n * p;
  const variance = n * p * (1 - p);
  const stdDev = Math.sqrt(variance);

  const prob0to5: number[] = [];
  for (let k = 0; k <= 5 && k <= n; k++) {
    prob0to5.push(binomialProb(n, k, p));
  }

  // Monte Carlo
  const rng = mulberry32(seed);
  let totalDrops = 0;
  let atLeastOneCount = 0;
  for (let t = 0; t < trials; t++) {
    let count = 0;
    for (let i = 0; i < n; i++) {
      if (rng() < p) count++;
    }
    totalDrops += count;
    if (count >= 1) atLeastOneCount++;
  }

  return {
    probAtLeastOne,
    expectedDrops,
    variance,
    stdDev,
    prob0to5,
    monteCarlo: {
      mean: totalDrops / trials,
      p1: atLeastOneCount / trials,
      seed,
    },
  };
}
