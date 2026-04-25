// 여고리셋 게임 표기: K/M/G/T (1000진법)
const UNITS: [number, string][] = [
  [1e12, 'T'],
  [1e9, 'G'],
  [1e6, 'M'],
  [1e3, 'K'],
];

export function formatGameNumber(n: number, digits = 3): string {
  if (!isFinite(n) || isNaN(n)) return '-';
  if (n === 0) return '0';
  const abs = Math.abs(n);
  const sign = n < 0 ? '-' : '';
  for (const [threshold, unit] of UNITS) {
    if (abs >= threshold) {
      const val = abs / threshold;
      const fixed = parseFloat(val.toPrecision(digits));
      return `${sign}${fixed}${unit}`;
    }
  }
  return `${sign}${parseFloat(abs.toPrecision(digits))}`;
}

// 퍼센트 표기 (소수점 1자리)
export function formatPct(n: number): string {
  return `${n.toFixed(1)}%`;
}

// 천 단위 콤마 (정수)
export function formatInt(n: number): string {
  return Math.round(n).toLocaleString('ko-KR');
}

// 게임 숫자 입력 파싱 (55.7K, 247M, 1.09K%, 3.09G 등)
export function parseGameNumber(s: string): number {
  const clean = s.trim().replace(/,/g, '');
  const pct = clean.endsWith('%') ? clean.slice(0, -1) : null;
  const str = pct ?? clean;

  for (const [threshold, unit] of UNITS) {
    if (str.toUpperCase().endsWith(unit)) {
      const num = parseFloat(str.slice(0, -unit.length));
      if (isNaN(num)) return NaN;
      return pct !== null ? (num * threshold) / 100 : num * threshold;
    }
  }
  const num = parseFloat(str);
  return pct !== null ? num / 100 : num;
}
