import { useEffect } from 'react';
import { HashRouter } from 'react-router-dom';
import { ToastProvider } from './components/pixel';
import { AppRouter } from './router';
import { useAuthStore } from './store/authStore';

function AuthInit() {
  const init = useAuthStore((s) => s.init);
  useEffect(() => {
    const unsubscribe = init();
    return unsubscribe;
  }, [init]);
  return null;
}

export function App() {
  return (
    <HashRouter>
      <ToastProvider>
        <AuthInit />
        <AppRouter />
      </ToastProvider>
    </HashRouter>
  );
}
