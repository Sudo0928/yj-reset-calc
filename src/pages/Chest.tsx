import { ChestCalculator } from '@/calculators/chest/ChestCalculator';
import { PixelBadge } from '@/components/pixel';

export function Chest() {
  return (
    <div style={{ paddingTop: 24 }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
          <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>상자 EV 계산기</h1>
          <PixelBadge variant="pink">Phase 5 MVP</PixelBadge>
        </div>
        <p style={{ fontSize: 12, color: 'var(--color-ink-muted)', margin: 0, lineHeight: 1.7 }}>
          <strong>즉시 개봉 가성비</strong>: 자연 해제 시간 가치와 즉시 개봉 다이아 비용을 비교해 추천.<br />
          <strong>N회 개봉 EV</strong>: 단순 베르누이 가정으로 1개 이상 획득 확률 + 분포 + 몬테카를로 시뮬.
        </p>
      </div>
      <ChestCalculator />
    </div>
  );
}
