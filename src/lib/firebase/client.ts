import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';

let _app: FirebaseApp | null = null;

export function getFirebaseApp(): FirebaseApp | null {
  if (!import.meta.env.VITE_FIREBASE_API_KEY) return null;
  if (_app) return _app;
  _app = initializeApp({
    apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId:             import.meta.env.VITE_FIREBASE_APP_ID,
  });
  return _app;
}

export function isFirebaseReady(): boolean {
  return !!import.meta.env.VITE_FIREBASE_API_KEY;
}

export { getApps };
