import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { Home } from './pages/Home';
import { NotFound } from './pages/NotFound';
import { MyData } from './pages/MyData';
import { Damage } from './pages/Damage';
import { Gold } from './pages/Gold';
import { Chest } from './pages/Chest';
import { Tips } from './pages/Tips';
import { Stats } from './pages/Stats';
import { Hourly } from './pages/Hourly';
import { Decisions } from './pages/Decisions';

const DevGallery = lazy(() =>
  import('./pages/DevGallery').then((m) => ({ default: m.DevGallery })),
);

export function AppRouter() {
  return (
    <Suspense fallback={<div style={{ padding: 16 }}>로딩 중...</div>}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/damage" element={<Damage />} />
          <Route path="/gold" element={<Gold />} />
          <Route path="/chest" element={<Chest />} />
          <Route path="/tips" element={<Tips />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/hourly" element={<Hourly />} />
          <Route path="/decisions" element={<Decisions />} />
          <Route path="/my-data" element={<MyData />} />
          {import.meta.env.DEV && (
            <Route path="/dev/components" element={<DevGallery />} />
          )}
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
