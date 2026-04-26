import { HourlyCalculator } from '@/calculators/hourly/HourlyCalculator';
import { PixelBadge } from '@/components/pixel';

export function Hourly() {
  return (
    <div style={{ paddingTop: 24 }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
          <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>시간당 자원 시뮬</h1>
          <PixelBadge variant="pink">Phase 8</PixelBadge>
        </div>
        <p style={{ fontSize: 12, color: 'var(--color-ink-muted)', margin: 0, lineHeight: 1.7 }}>
          빌드(33필드) + 환경 입력 → 시간당/일/주 골드·빛파편·연구회전·방치보상을 계산합니다.
          게임이 보여주지 않는 누적·환산값을 한눈에 볼 수 있습니다.
        </p>
      </div>
      <HourlyCalculator />
    </div>
  );
}
