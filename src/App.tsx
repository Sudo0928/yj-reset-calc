import { HashRouter } from 'react-router-dom';
import { ToastProvider } from './components/pixel';
import { AppRouter } from './router';

export function App() {
  return (
    <HashRouter>
      <ToastProvider>
        <AppRouter />
      </ToastProvider>
    </HashRouter>
  );
}
