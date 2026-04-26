// 빌드 객체를 URL hash에 안전하게 인코딩/디코딩
// 한글 포함 가능하므로 UTF-8 처리

import type { StatsFlat, EnvInput } from '@/data/statsSchema';

export interface BuildSnapshot {
  stats: StatsFlat;
  env: EnvInput;
}

export interface ComparePayload {
  v: 1;            // schemaVersion
  l: BuildSnapshot;
  r: BuildSnapshot;
}

function utf8ToB64(s: string): string {
  return btoa(unescape(encodeURIComponent(s)));
}

function b64ToUtf8(b64: string): string {
  return decodeURIComponent(escape(atob(b64)));
}

export function encodeCompare(payload: ComparePayload): string {
  const json = JSON.stringify(payload);
  return utf8ToB64(json).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function decodeCompare(b64url: string): ComparePayload | null {
  try {
    const b64 = b64url.replace(/-/g, '+').replace(/_/g, '/');
    const padded = b64 + '==='.slice(0, (4 - b64.length % 4) % 4);
    const json = b64ToUtf8(padded);
    const parsed = JSON.parse(json);
    if (parsed.v !== 1) return null;
    if (!parsed.l?.stats || !parsed.l?.env || !parsed.r?.stats || !parsed.r?.env) return null;
    return parsed as ComparePayload;
  } catch {
    return null;
  }
}
