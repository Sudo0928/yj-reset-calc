import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  collection,
  getDocs,
  serverTimestamp,
  type Firestore,
} from 'firebase/firestore';
import { getFirebaseApp } from './client';

let _db: Firestore | null = null;

export function getDb(): Firestore | null {
  const app = getFirebaseApp();
  if (!app) return null;
  if (_db) return _db;
  _db = getFirestore(app);
  return _db;
}

// ─── 사용자 프로필 ───────────────────────────────────────────────────────────
export async function upsertProfile(uid: string, data: Record<string, unknown>): Promise<void> {
  const db = getDb();
  if (!db) return;
  await setDoc(doc(db, 'users', uid, 'profile', 'singleton'), {
    ...data,
    updatedAt: serverTimestamp(),
  }, { merge: true });
}

// ─── 계산기 상태 ─────────────────────────────────────────────────────────────
export async function getCalcState(uid: string, calcId: string): Promise<Record<string, unknown> | null> {
  const db = getDb();
  if (!db) return null;
  const snap = await getDoc(doc(db, 'users', uid, 'calculatorState', calcId));
  return snap.exists() ? (snap.data() as Record<string, unknown>) : null;
}

export async function setCalcState(uid: string, calcId: string, inputs: Record<string, unknown>): Promise<void> {
  const db = getDb();
  if (!db) return;
  await setDoc(doc(db, 'users', uid, 'calculatorState', calcId), {
    inputs,
    updatedAt: serverTimestamp(),
  });
}

// ─── 프리셋 ──────────────────────────────────────────────────────────────────
export async function getAllPresets(uid: string): Promise<Record<string, unknown>[]> {
  const db = getDb();
  if (!db) return [];
  const snap = await getDocs(collection(db, 'users', uid, 'presets'));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function savePreset(uid: string, id: string, data: Record<string, unknown>): Promise<void> {
  const db = getDb();
  if (!db) return;
  await setDoc(doc(db, 'users', uid, 'presets', id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deletePreset(uid: string, id: string): Promise<void> {
  const db = getDb();
  if (!db) return;
  await deleteDoc(doc(db, 'users', uid, 'presets', id));
}

// ─── 커스텀 데이터 ────────────────────────────────────────────────────────────
export async function getAllCustomData(uid: string, type: string): Promise<Record<string, unknown>[]> {
  const db = getDb();
  if (!db) return [];
  const snap = await getDocs(collection(db, 'users', uid, 'customData', type, 'items'));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function saveCustomItem(uid: string, type: string, id: string, data: Record<string, unknown>): Promise<void> {
  const db = getDb();
  if (!db) return;
  await setDoc(doc(db, 'users', uid, 'customData', type, 'items', id), {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteCustomItem(uid: string, type: string, id: string): Promise<void> {
  const db = getDb();
  if (!db) return;
  await deleteDoc(doc(db, 'users', uid, 'customData', type, 'items', id));
}
