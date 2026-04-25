import { DamageCalculator } from '@/calculators/damage/DamageCalculator';
import { PixelBadge } from '@/components/pixel';

export function Damage() {
  return (
    <div style={{ paddingTop: 24 }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
          <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>데미지 / 스탯 계산기</h1>
          <PixelBadge variant="pink">Phase 3 MVP</PixelBadge>
          <PixelBadge variant="tbd">모드 A — 직접 입력</PixelBadge>
        </div>
        <p style={{ fontSize: 12, color: 'var(--color-ink-muted)', margin: 0, lineHeight: 1.7 }}>
          게임 스펙창에서 본 수치를 그대로 입력하세요. 방어력 없음(층 무관), 치명타 배수 1.5× 추정.
          <br />
          스킬 계수는 스킬 설명란의 피해량%를 입력하세요.
        </p>
      </div>

      <DamageCalculator />
    </div>
  );
}
