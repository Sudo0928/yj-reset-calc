import { describe, it, expect } from 'vitest';
import { formatGameNumber, parseGameNumber, formatPct } from './number';

describe('formatGameNumber — 게임 단위 표기', () => {
  it('1000 미만은 그대로', () => {
    expect(formatGameNumber(123)).toBe('123');
  });
  it('1K = 1000', () => {
    expect(formatGameNumber(1000)).toBe('1K');
  });
  it('247.2M', () => {
    expect(formatGameNumber(247_200_000)).toBe('247M');
  });
  it('1.23T', () => {
    expect(formatGameNumber(1_230_000_000_000)).toBe('1.23T');
  });
  it('NaN/Infinity → "-"', () => {
    expect(formatGameNumber(NaN)).toBe('-');
    expect(formatGameNumber(Infinity)).toBe('-');
  });
  it('0은 0', () => {
    expect(formatGameNumber(0)).toBe('0');
  });
});

describe('parseGameNumber — 단위 파싱', () => {
  it('"55.7M" → 55,700,000', () => {
    expect(parseGameNumber('55.7M')).toBe(55_700_000);
  });
  it('"247.2G" → 247,200,000,000', () => {
    expect(parseGameNumber('247.2G')).toBe(247_200_000_000);
  });
  it('"1.23T" → 1.23e12', () => {
    expect(parseGameNumber('1.23T')).toBeCloseTo(1.23e12);
  });
  it('"100" 단위 없음 → 100', () => {
    expect(parseGameNumber('100')).toBe(100);
  });
  it('"110%" → 1.1 (퍼센트는 /100)', () => {
    expect(parseGameNumber('110%')).toBeCloseTo(1.1);
  });
  it('"1.09K%" → 10.9', () => {
    expect(parseGameNumber('1.09K%')).toBeCloseTo(10.9);
  });
});

describe('formatPct', () => {
  it('소수점 1자리 + %', () => {
    expect(formatPct(50)).toBe('50.0%');
    expect(formatPct(33.333)).toBe('33.3%');
  });
});
