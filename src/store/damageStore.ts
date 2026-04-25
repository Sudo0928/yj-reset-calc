import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DamageInput } from '@/lib/formulas/damage';

interface DamageState {
  input: DamageInput;
  setInput: (patch: Partial<DamageInput>) => void;
  reset: () => void;
}

const DEFAULT_INPUT: DamageInput = {
  atk: 1000,
  critRate: 0.15,
  critDmg: 2.0,
  skillDmgMul: 1.0,
  additionalDmgMul: 1.0,
  penetration: 0,
  skillCoeff: 1.2,
  skillCooldown: 2.0,
  allBuffStage: 0,
  temporaryBuffMul: 1.0,
  equipAtkBonus: 0,
  equipCritBonus: 0,
  costumeAtkBonus: 0,
  companionAtkBonus: 0,
  companionCritDmgBonus: 0,
  cardDmgBonus: 0,
  cardAtkBonus: 0,
  cardCritBonus: 0,
  enemyDefense: 0,
  stageDamageReduction: 0,
  isBoss: false,
};

export const useDamageStore = create<DamageState>()(
  persist(
    (set) => ({
      input: DEFAULT_INPUT,

      setInput: (patch) => {
        set((state) => ({ input: { ...state.input, ...patch } }));
      },

      reset: () => {
        set({ input: DEFAULT_INPUT });
      },
    }),
    {
      name: 'yjreset:damage',
    },
  ),
);
