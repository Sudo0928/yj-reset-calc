import { create } from 'zustand';
import type { User } from 'firebase/auth';
import { subscribeAuthState, signInWithGoogle, firebaseSignOut } from '@/lib/firebase/auth';
import { upsertProfile } from '@/lib/firebase/firestore';
import { isFirebaseReady } from '@/lib/firebase/client';

interface AuthState {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  error: string | null;
  firebaseEnabled: boolean;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  setError: (msg: string | null) => void;
  init: () => () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  initialized: false,
  error: null,
  firebaseEnabled: isFirebaseReady(),

  signIn: async () => {
    set({ loading: true, error: null });
    try {
      await signInWithGoogle();
    } catch (err) {
      const msg = err instanceof Error ? err.message : '로그인 실패';
      set({ error: msg });
    } finally {
      set({ loading: false });
    }
  },

  signOut: async () => {
    set({ loading: true });
    await firebaseSignOut();
    set({ user: null, loading: false });
  },

  setError: (error) => set({ error }),

  init: () => {
    if (!isFirebaseReady()) {
      set({ initialized: true });
      return () => {};
    }
    const unsubscribe = subscribeAuthState(async (user) => {
      set({ user, initialized: true });
      if (user) {
        await upsertProfile(user.uid, {
          displayName: user.displayName ?? '',
          photoURL: user.photoURL ?? '',
          schemaVersion: 1,
        }).catch(() => {});
      }
    });
    return unsubscribe;
  },
}));
