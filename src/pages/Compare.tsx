import { CompareCalculator } from '@/calculators/compare/CompareCalculator';
import { PixelBadge } from '@/components/pixel';

export function Compare() {
  return (
    <div style={{ paddingTop: 24 }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
          <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>빌드 비교 (Before vs After)</h1>
          <PixelBadge variant="pink">Phase 10</PixelBadge>
        </div>
        <p style={{ fontSize: 12, color: 'var(--color-ink-muted)', margin: 0, lineHeight: 1.7 }}>
          좌(현재 빌드) vs 우(가정 빌드)의 DPS·시간당골드·생존력 차이 + 민감도 top 5 + URL 공유.
          좌측은 <strong>/stats</strong>에서 편집하고, 우측은 인라인으로 변경 후 영향을 즉시 확인하세요.
        </p>
      </div>
      <CompareCalculator />
    </div>
  );
}
