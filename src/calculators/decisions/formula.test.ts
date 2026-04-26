import { describe, it, expect } from 'vitest';
import { calcDiamondAllocation, calcBuffBep, calcReclimb } from './formula';
import { DEFAULT_DIAMOND_INPUT, DEFAULT_BUFF_BEP_INPUT, DEFAULT_RECLIMB_INPUT } from './types';

describe('calcDiamondAllocation — 다이아 분배 ROI', () => {
  it('다이아 1000개 입력 시 기본 카드 (뽑기권/달빛) 노출', () => {
    const r = calcDiamondAllocation({ ...DEFAULT_DIAMOND_INPUT, diamonds: 1000 });
    const ids = r.cards.map((c) => c.id);
    expect(ids).toContain('summon-ticket');
    expect(ids).toContain('moonlight');
  });

  it('달빛 ROI 1.16배가 가장 높음 (뽑기권=1.0)', () => {
    const r = calcDiamondAllocation({ ...DEFAULT_DIAMOND_INPUT, diamonds: 3000 });
    expect(r.bestCardId).toBe('moonlight');
  });

  it('1000다이아 → 뽑기권 약 13.16개 (1000/76)', () => {
    const r = calcDiamondAllocation({ ...DEFAULT_DIAMOND_INPUT, diamonds: 1000 });
    const ticket = r.cards.find((c) => c.id === 'summon-ticket')!;
    expect(ticket.amount).toBeCloseTo(1000 / 76);
  });

  it('3000다이아 → 달빛 1000 (300당 100)', () => {
    const r = calcDiamondAllocation({ ...DEFAULT_DIAMOND_INPUT, diamonds: 3000 });
    const moon = r.cards.find((c) => c.id === 'moonlight')!;
    expect(moon.amount).toBe(1000);
  });

  it('골드 직구 환율 입력 시 골드 카드 추가', () => {
    const r = calcDiamondAllocation({ ...DEFAULT_DIAMOND_INPUT, diamonds: 1000, goldPerDiamondShop: 10000 });
    const gold = r.cards.find((c) => c.id === 'gold-shop')!;
    expect(gold.amount).toBe(10_000_000); // 1000 × 10K
  });
});

describe('calcBuffBep — 신화 버프작 BEP', () => {
  it('현재 골획 200% → 신화 +30% → 최종 +15%', () => {
    const r = calcBuffBep({ ...DEFAULT_BUFF_BEP_INPUT, currentGoldAcq: 200, buffBonusPct: 30 });
    expect(r.finalValueIncreasePct).toBeCloseTo(15);
  });

  it('현재 골획 400% → +7.5%', () => {
    const r = calcBuffBep({ ...DEFAULT_BUFF_BEP_INPUT, currentGoldAcq: 400 });
    expect(r.finalValueIncreasePct).toBeCloseTo(7.5);
  });

  it('현재 골획 100% → +30%', () => {
    const r = calcBuffBep({ ...DEFAULT_BUFF_BEP_INPUT, currentGoldAcq: 100 });
    expect(r.finalValueIncreasePct).toBeCloseTo(30);
  });

  it('분당 200K 골드 × 30분 × 15% = 900K 추가 골드', () => {
    const r = calcBuffBep({
      ...DEFAULT_BUFF_BEP_INPUT,
      currentGoldAcq: 200,
      goldPerMinMeasured: 200_000,
      buffDurationMin: 30,
      buffBonusPct: 30,
    });
    expect(r.extraGoldDuringBuff).toBeCloseTo(900_000);
  });

  it('현재 골획 0이면 증가율 0 + 안내 메시지', () => {
    const r = calcBuffBep({ ...DEFAULT_BUFF_BEP_INPUT, currentGoldAcq: 0 });
    expect(r.finalValueIncreasePct).toBe(0);
    expect(r.bepSummary).toContain('필요');
  });
});

describe('calcReclimb — 재등반 ROI 비교', () => {
  it('가장 높은 분당 골드를 best로', () => {
    const r = calcReclimb({
      ...DEFAULT_RECLIMB_INPUT,
      candidates: [
        { id: 'a', label: 'A', goldPerMin: 100_000, shardPerHour: 0, boxesPerHour: 0 },
        { id: 'b', label: 'B', goldPerMin: 200_000, shardPerHour: 0, boxesPerHour: 0 },
        { id: 'c', label: 'C', goldPerMin: 50_000, shardPerHour: 0, boxesPerHour: 0 },
      ],
    });
    expect(r.best?.id).toBe('b');
    expect(r.ranked[0]!.id).toBe('b');
    expect(r.ranked[2]!.id).toBe('c');
  });

  it('모두 0이면 best는 null', () => {
    const r = calcReclimb({
      ...DEFAULT_RECLIMB_INPUT,
      candidates: [{ id: 'a', label: 'A', goldPerMin: 0, shardPerHour: 0, boxesPerHour: 0 }],
    });
    expect(r.best).toBeNull();
  });

  it('시간당 = 분당 × 60', () => {
    const r = calcReclimb({
      ...DEFAULT_RECLIMB_INPUT,
      candidates: [{ id: 'a', label: 'A', goldPerMin: 100_000, shardPerHour: 0, boxesPerHour: 0 }],
    });
    expect(r.ranked[0]!.goldPerHour).toBe(6_000_000);
  });
});
