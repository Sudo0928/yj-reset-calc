import { GoldCalculator } from '@/calculators/gold/GoldCalculator';
import { PixelBadge } from '@/components/pixel';

export function Gold() {
  return (
    <div style={{ paddingTop: 24 }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
          <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>골드 / 빛의파편 계산기</h1>
          <PixelBadge variant="pink">Phase 4 MVP</PixelBadge>
        </div>
        <p style={{ fontSize: 12, color: 'var(--color-ink-muted)', margin: 0, lineHeight: 1.7 }}>
          <strong>골드 효율</strong>: 현재 분당 골드 획득량과 골획%를 입력하면 수치 변경 시 예측 획득량을 계산합니다.<br />
          <strong>빛의파편</strong>: 슬라임 합성 레벨·달빛 충전 횟수 기반 빛의파편 획득량 및 다이아 환산 효율을 계산합니다.
        </p>
      </div>

      <GoldCalculator />
    </div>
  );
}
