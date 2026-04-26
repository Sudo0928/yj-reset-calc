// Firestore ↔ LocalStorage 자동 동기화 헬퍼
// 로그인 시 cloud → local 머지, 변경 시 local → cloud push

import {
  getAllPresets, savePreset, deletePreset,
  getAllCustomData, saveCustomItem, deleteCustomItem,
  getCalcState, setCalcState,
} from './firestore';
import { getDb } from './firestore';
import { isFirebaseReady } from './client';
import type { Preset, CustomDataItem } from '@/lib/storage/schema';
import { CustomDataItemSchema, PresetSchema } from '@/lib/storage/schema';

const CUSTOM_TYPES = ['companion', 'equipment', 'costume', 'skill', 'card'] as const;

// ─── 로컬 ↔ 클라우드 머지 (preset/customData) ────────────────────────────

/**
 * 클라우드의 프리셋을 받아 로컬과 머지한다.
 * 동일 id 충돌 시: createdAt이 더 최근인 것 우선 (사이트는 createdAt만 사용, updatedAt은 옵션).
 */
export async function fetchPresetsFromCloud(uid: string): Promise<Preset[]> {
  if (!isFirebaseReady() || !getDb()) return [];
  try {
    const raw = await getAllPresets(uid);
    return raw
      .map((r) => PresetSchema.safeParse(r))
      .filter((r): r is { success: true; data: Preset } => r.success)
      .map((r) => r.data);
  } catch {
    return [];
  }
}

export async function fetchCustomDataFromCloud(uid: string): Promise<CustomDataItem[]> {
  if (!isFirebaseReady() || !getDb()) return [];
  const items: CustomDataItem[] = [];
  for (const type of CUSTOM_TYPES) {
    try {
      const raw = await getAllCustomData(uid, type);
      raw.forEach((r) => {
        const parsed = CustomDataItemSchema.safeParse(r);
        if (parsed.success) items.push(parsed.data);
      });
    } catch {
      // 한 종류 실패해도 다른 종류는 계속
    }
  }
  return items;
}

export async function fetchCalcStateFromCloud(
  uid: string,
  calcId: string,
): Promise<Record<string, unknown> | null> {
  if (!isFirebaseReady() || !getDb()) return null;
  try {
    const data = await getCalcState(uid, calcId);
    if (!data) return null;
    // setCalcState에서는 { inputs, updatedAt } 형태로 저장
    return (data.inputs as Record<string, unknown>) ?? null;
  } catch {
    return null;
  }
}

// ─── Push (단일 변경) ────────────────────────────────────────────────────

export async function pushPreset(uid: string | undefined, preset: Preset): Promise<void> {
  if (!uid || !isFirebaseReady()) return;
  try {
    await savePreset(uid, preset.id, preset as unknown as Record<string, unknown>);
  } catch { /* 네트워크 오류 무시 — 로컬은 이미 저장됨 */ }
}

export async function pushPresetDelete(uid: string | undefined, presetId: string): Promise<void> {
  if (!uid || !isFirebaseReady()) return;
  try { await deletePreset(uid, presetId); } catch {}
}

export async function pushCustomItem(uid: string | undefined, item: CustomDataItem): Promise<void> {
  if (!uid || !isFirebaseReady()) return;
  try {
    await saveCustomItem(uid, item.type, item.id, item as unknown as Record<string, unknown>);
  } catch {}
}

export async function pushCustomItemDelete(
  uid: string | undefined,
  type: string,
  id: string,
): Promise<void> {
  if (!uid || !isFirebaseReady()) return;
  try { await deleteCustomItem(uid, type, id); } catch {}
}

export async function pushCalcState(
  uid: string | undefined,
  calcId: string,
  inputs: Record<string, unknown>,
): Promise<void> {
  if (!uid || !isFirebaseReady()) return;
  try { await setCalcState(uid, calcId, inputs); } catch {}
}

// ─── ID 기반 머지 (동일 id 시 더 최근 timestamp 우선) ──────────────────

export function mergePresets(local: Preset[], cloud: Preset[]): Preset[] {
  const byId = new Map<string, Preset>();
  for (const p of local) byId.set(p.id, p);
  for (const p of cloud) {
    const existing = byId.get(p.id);
    if (!existing || p.createdAt >= existing.createdAt) byId.set(p.id, p);
  }
  return Array.from(byId.values());
}

export function mergeCustomData(local: CustomDataItem[], cloud: CustomDataItem[]): CustomDataItem[] {
  const byId = new Map<string, CustomDataItem>();
  for (const it of local) byId.set(it.id, it);
  for (const it of cloud) {
    const existing = byId.get(it.id);
    if (!existing || it.updatedAt >= existing.updatedAt) byId.set(it.id, it);
  }
  return Array.from(byId.values());
}
