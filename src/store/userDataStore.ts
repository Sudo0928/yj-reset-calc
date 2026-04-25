import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CustomDataItem, Preset } from '@/lib/storage/schema';

let _nextId = Date.now();
function genId() { return String(++_nextId); }

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
}

export const useUserDataStore = create<UserDataState>()(
  persist(
    (set, get) => ({
      customData: [],
      presets: [],

      addCustomItem: (item) => {
        const newItem: CustomDataItem = { ...item, id: genId(), updatedAt: Date.now() };
        set((s) => ({ customData: [...s.customData, newItem] }));
        return newItem;
      },

      updateCustomItem: (id, patch) => {
        set((s) => ({
          customData: s.customData.map((it) =>
            it.id === id ? { ...it, ...patch, updatedAt: Date.now() } : it,
          ),
        }));
      },

      removeCustomItem: (id) => {
        set((s) => ({ customData: s.customData.filter((it) => it.id !== id) }));
      },

      addPreset: (preset) => {
        const newPreset: Preset = { ...preset, id: genId(), createdAt: Date.now() };
        set((s) => ({ presets: [...s.presets, newPreset] }));
        return newPreset;
      },

      updatePreset: (id, patch) => {
        set((s) => ({
          presets: s.presets.map((p) => (p.id === id ? { ...p, ...patch } : p)),
        }));
      },

      removePreset: (id) => {
        set((s) => ({ presets: s.presets.filter((p) => p.id !== id) }));
      },

      mergeImport: (incoming, mode) => {
        if (mode === 'overwrite') {
          set({ customData: incoming.customData, presets: incoming.presets });
          return;
        }
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
      },

      exportData: () => {
        const { customData, presets } = get();
        return { customData, presets };
      },
    }),
    {
      name: 'yjreset:userData',
    },
  ),
);
