import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CustomDataItem, Preset } from '@/lib/storage/schema';
import {
  fetchPresetsFromCloud, fetchCustomDataFromCloud,
  pushPreset, pushPresetDelete, pushCustomItem, pushCustomItemDelete,
  mergePresets, mergeCustomData,
} from '@/lib/firebase/sync';
import { useAuthStore } from './authStore';

let _nextId = Date.now();
function genId() { return String(++_nextId); }

function currentUid(): string | undefined {
  return useAuthStore.getState().user?.uid;
}

interface UserDataState {
  customData: CustomDataItem[];
  presets: Preset[];
  addCustomItem: (item: Omit<CustomDataItem, 'id' | 'updatedAt'>) => CustomDataItem;
  updateCustomItem: (id: string, patch: Partial<Omit<CustomDataItem, 'id'>>) => void;
  removeCustomItem: (id: string) => void;
  addPreset: (preset: Omit<Preset, 'id' | 'createdAt'>) => Preset;
  updatePreset: (id: string, patch: Partial<Omit<Preset, 'id' | 'createdAt'>>) => void;
  removePreset: (id: string) => void;
  mergeImport: (incoming: { customData: CustomDataItem[]; presets: Preset[] }, mode: 'merge' | 'overwrite') => void;
  exportData: () => { customData: CustomDataItem[]; presets: Preset[] };
  syncFromCloud: (uid: string) => Promise<void>;
}

export const useUserDataStore = create<UserDataState>()(
  persist(
    (set, get) => ({
      customData: [],
      presets: [],

      addCustomItem: (item) => {
        const newItem: CustomDataItem = { ...item, id: genId(), updatedAt: Date.now() };
        set((s) => ({ customData: [...s.customData, newItem] }));
        void pushCustomItem(currentUid(), newItem);
        return newItem;
      },

      updateCustomItem: (id, patch) => {
        let updated: CustomDataItem | undefined;
        set((s) => ({
          customData: s.customData.map((it) => {
            if (it.id !== id) return it;
            updated = { ...it, ...patch, updatedAt: Date.now() } as CustomDataItem;
            return updated;
          }),
        }));
        if (updated) void pushCustomItem(currentUid(), updated);
      },

      removeCustomItem: (id) => {
        const removed = get().customData.find((it) => it.id === id);
        set((s) => ({ customData: s.customData.filter((it) => it.id !== id) }));
        if (removed) void pushCustomItemDelete(currentUid(), removed.type, id);
      },

      addPreset: (preset) => {
        const newPreset: Preset = { ...preset, id: genId(), createdAt: Date.now() };
        set((s) => ({ presets: [...s.presets, newPreset] }));
        void pushPreset(currentUid(), newPreset);
        return newPreset;
      },

      updatePreset: (id, patch) => {
        let updated: Preset | undefined;
        set((s) => ({
          presets: s.presets.map((p) => {
            if (p.id !== id) return p;
            updated = { ...p, ...patch };
            return updated;
          }),
        }));
        if (updated) void pushPreset(currentUid(), updated);
      },

      removePreset: (id) => {
        set((s) => ({ presets: s.presets.filter((p) => p.id !== id) }));
        void pushPresetDelete(currentUid(), id);
      },

      mergeImport: (incoming, mode) => {
        if (mode === 'overwrite') {
          set({ customData: incoming.customData, presets: incoming.presets });
        } else {
          const { customData, presets } = get();
          const existingCustomIds = new Set(customData.map((it) => it.id));
          const existingPresetIds = new Set(presets.map((p) => p.id));
          set({
            customData: [
              ...customData,
              ...incoming.customData.filter((it) => !existingCustomIds.has(it.id)),
            ],
            presets: [
              ...presets,
              ...incoming.presets.filter((p) => !existingPresetIds.has(p.id)),
            ],
          });
        }
        // 임포트 결과를 클라우드에도 푸시
        const uid = currentUid();
        if (uid) {
          for (const p of get().presets) void pushPreset(uid, p);
          for (const it of get().customData) void pushCustomItem(uid, it);
        }
      },

      exportData: () => {
        const { customData, presets } = get();
        return { customData, presets };
      },

      syncFromCloud: async (uid) => {
        const [cloudPresets, cloudCustom] = await Promise.all([
          fetchPresetsFromCloud(uid),
          fetchCustomDataFromCloud(uid),
        ]);
        const local = get();
        const mergedPresets = mergePresets(local.presets, cloudPresets);
        const mergedCustom = mergeCustomData(local.customData, cloudCustom);
        set({ presets: mergedPresets, customData: mergedCustom });

        // 로컬에만 있던 항목을 클라우드에도 push
        const cloudPresetIds = new Set(cloudPresets.map((p) => p.id));
        const cloudCustomIds = new Set(cloudCustom.map((it) => it.id));
        for (const p of mergedPresets) {
          if (!cloudPresetIds.has(p.id)) void pushPreset(uid, p);
        }
        for (const it of mergedCustom) {
          if (!cloudCustomIds.has(it.id)) void pushCustomItem(uid, it);
        }
      },
    }),
    {
      name: 'yjreset:userData',
    },
  ),
);
