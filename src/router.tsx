import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { Home } from './pages/Home';
import { NotFound } from './pages/NotFound';

const DevGallery = lazy(() =>
  import('./pages/DevGallery').then((m) => ({ default: m.DevGallery })),
);

function WipPage({ title }: { title: string }) {
  return (
    <div style={{ padding: '32px 0' }}>
      <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{title}</h1>
      <p style={{ color: 'var(--color-ink-muted)', fontSize: 13 }}>
        이 계산기는 현재 개발 중입니다. 게임 데이터가 준비되면 활성화됩니다.
      </p>
    </div>
  );
}

export function AppRouter() {
  return (
    <Suspense fallback={<div style={{ padding: 16 }}>로딩 중...</div>}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/damage" element={<WipPage title="데미지 / 스탯 계산기" />} />
          <Route path="/gold" element={<WipPage title="골드 / 빛의파편 계산기" />} />
          <Route path="/chest" element={<WipPage title="상자 EV 계산기" />} />
          <Route path="/tips" element={<WipPage title="팁 / FAQ / 용어사전" />} />
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
