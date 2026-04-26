import { DecisionsCalculator } from '@/calculators/decisions/DecisionsCalculator';
import { PixelBadge } from '@/components/pixel';

export function Decisions() {
  return (
    <div style={{ paddingTop: 24 }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
          <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>자원 의사결정</h1>
          <PixelBadge variant="pink">Phase 9</PixelBadge>
        </div>
        <p style={{ fontSize: 12, color: 'var(--color-ink-muted)', margin: 0, lineHeight: 1.7 }}>
          <strong>다이아 N개 분배 ROI</strong>: 같은 다이아를 골드/뽑기권/달빛/광제/슬마팩 중 어디에 쓸 때 효율 최대인지.<br />
          <strong>신화 버프작 BEP</strong>: 현재 골획%에 따라 신화 +30% 효과의 실제 가치 계산.<br />
          <strong>재등반 ROI 비교</strong>: 13층 vs 100층 vs 90층 vs 14층 시간당 골드 비교.
        </p>
      </div>
      <DecisionsCalculator />
    </div>
  );
}
