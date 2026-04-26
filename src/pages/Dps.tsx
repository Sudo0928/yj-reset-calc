import { DpsCalculator } from '@/calculators/dps/DpsCalculator';
import { PixelBadge } from '@/components/pixel';

export function Dps() {
  return (
    <div style={{ paddingTop: 24 }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
          <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>종합 DPS 분해</h1>
          <PixelBadge variant="pink">Phase 11</PixelBadge>
        </div>
        <p style={{ fontSize: 12, color: 'var(--color-ink-muted)', margin: 0, lineHeight: 1.7 }}>
          여고생 / 드론 / 동료 각각의 DPS 비중을 분석. 인게임 합산 DPS를 입력하면 사이트 추정치와 차이를 표시하여 공식의 정확도를 검증할 수 있습니다.
          <br />어느 부분이 약한지 한눈에 진단하세요.
        </p>
      </div>
      <DpsCalculator />
    </div>
  );
}
