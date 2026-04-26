import { describe, it, expect } from 'vitest';
import { BOSS_DESPAIR_14, getBossStage, bossHpAsNumber, bossDamageAsNumber } from '@/data/bossDespair14';
import { COSTUMES, LEVELUP_GAIN_BY_GRADE, costumeShardCost, levelupCost } from '@/data/costumes';
import { RUNE_COST_BY_GRADE, RUNE_LOCK_MULTIPLIER } from '@/data/runes';
import { totalRuneCost } from '@/data/companionTraits';
import { vipPackTotalValue, VIP_PACK } from '@/data/vipPack';

describe('bossDespair14 — 100층 데이터 정합성', () => {
  it('정확히 100개 층 정의됨', () => {
    expect(BOSS_DESPAIR_14).toHaveLength(100);
  });

  it('1층부터 100층까지 연속', () => {
    BOSS_DESPAIR_14.forEach((b, i) => expect(b.stage).toBe(i + 1));
  });

  it('14-50층 = 520T HP, 4.55T 피격', () => {
    const stage50 = getBossStage(50);
    expect(stage50?.hp).toBe(520);
    expect(stage50?.damage).toBeCloseTo(4.55);
  });

  it('14-100층 = 1.05P (단위 P)', () => {
    const stage100 = getBossStage(100);
    expect(stage100?.hp).toBe(1.05);
    expect(stage100?.hpUnit).toBe('P');
    // 1.05P = 1.05e15
    expect(bossHpAsNumber(stage100!)).toBeCloseTo(1.05e15);
  });

  it('피격 데미지는 HP의 약 1% 비율', () => {
    BOSS_DESPAIR_14.forEach((b) => {
      const ratio = bossDamageAsNumber(b) / bossHpAsNumber(b);
      expect(ratio).toBeGreaterThan(0.005);
      expect(ratio).toBeLessThan(0.015);
    });
  });

  it('홀수번대 5층 단위로 근접/원거리 패턴', () => {
    expect(getBossStage(1)?.type).toBe('근접');
    expect(getBossStage(5)?.type).toBe('원거리');
    expect(getBossStage(11)?.type).toBe('근접');
    expect(getBossStage(100)?.type).toBe('원거리');
  });
});

describe('costumes — 등급별 레벨업 효율', () => {
  it('6개 코스튬 정의됨', () => {
    expect(COSTUMES).toHaveLength(6);
  });

  it('SSR 등급이 R 등급보다 공격력 효율 2배', () => {
    expect(LEVELUP_GAIN_BY_GRADE.SSR.attackPct).toBe(LEVELUP_GAIN_BY_GRADE.R.attackPct * 2);
  });

  it('SR 등급의 공격력+생명력 합 > R 등급', () => {
    const r = LEVELUP_GAIN_BY_GRADE.R.attackPct + LEVELUP_GAIN_BY_GRADE.R.hpPct;
    const sr = LEVELUP_GAIN_BY_GRADE.SR.attackPct + LEVELUP_GAIN_BY_GRADE.SR.hpPct;
    expect(sr).toBeGreaterThan(r);
  });
});

describe('costumes — 레벨업 비용 공식 (SSR 실측값)', () => {
  it('SSR Lv1→2 = 15 (3×5×1)', () => {
    expect(costumeShardCost('SSR', 1, 2)).toBe(15);
  });
  it('SSR Lv99→100 = 1485 (3×5×99)', () => {
    expect(costumeShardCost('SSR', 99, 100)).toBe(1485);
  });
  it('SSR Lv100→101 = 1800 (3×6×100, 1돌파 후)', () => {
    expect(costumeShardCost('SSR', 100, 101)).toBe(1800);
  });
  it('SSR Lv101→102 = 1818 (3×6×101)', () => {
    expect(costumeShardCost('SSR', 101, 102)).toBe(1818);
  });
  it('SSR Lv307→308 = 7368 (3×8×307, 3돌파 후)', () => {
    expect(costumeShardCost('SSR', 307, 308)).toBe(7368);
  });
  it('levelupCost SSR n=100 → 1800', () => {
    expect(levelupCost('SSR', 100)).toBe(1800);
  });
});

describe('runes — 등급별 잠금 누적 비용', () => {
  it('일반 등급 1단계 = 10 룬', () => {
    expect(totalRuneCost('일반', 1)).toBe(10);
  });

  it('신화 5단계 누적 = 50+100+150+200+250 = 750', () => {
    expect(totalRuneCost('신화', 5)).toBe(50 + 100 + 150 + 200 + 250);
  });

  it('잠금 단계 0 또는 6 이상은 0 반환', () => {
    expect(totalRuneCost('일반', 0)).toBe(0);
    expect(totalRuneCost('일반', 6)).toBe(0);
  });

  it('등급별 1단계 비용이 단조증가', () => {
    expect(RUNE_COST_BY_GRADE.일반!).toBeLessThan(RUNE_COST_BY_GRADE.희귀!);
    expect(RUNE_COST_BY_GRADE.희귀!).toBeLessThan(RUNE_COST_BY_GRADE.영웅!);
    expect(RUNE_COST_BY_GRADE.영웅!).toBeLessThan(RUNE_COST_BY_GRADE.전설!);
    expect(RUNE_COST_BY_GRADE.전설!).toBeLessThan(RUNE_COST_BY_GRADE.신화!);
  });

  it('잠금 배수가 1, 2, 3, 4, 5', () => {
    expect(RUNE_LOCK_MULTIPLIER).toEqual([1, 2, 3, 4, 5]);
  });
});

describe('vipPack — 30일 누적 가치', () => {
  it('30일 동안 매일 200다이아 + 즉시 1000 = 7000', () => {
    const v = vipPackTotalValue();
    expect(v.totalDia).toBe(VIP_PACK.dailyDia * VIP_PACK.durationDays + VIP_PACK.instantDia);
  });

  it('뽑기권 100개 = 7600 다이아 가치', () => {
    const v = vipPackTotalValue();
    expect(v.totalTicketValue).toBe(100 * 76);
  });

  it('총 가치 / 30일 = 일일 평균', () => {
    const v = vipPackTotalValue();
    expect(v.perDayDia).toBeCloseTo(v.grandTotalDia / VIP_PACK.durationDays);
  });
});

