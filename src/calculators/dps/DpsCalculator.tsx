import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { calcDps, calcSurvival } from './formula';
import { useStatsStore } from '@/store/statsStore';
import { formatGameNumber, parseGameNumber } from '@/lib/format/number';
import { PixelCard, PixelInput, PixelBadge, PixelButton } from '@/components/pixel';

function Bar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 3 }}>
        <span>{label}</span>
        <span style={{ fontWeight: 700 }}>{formatGameNumber(value)}</span>
      </div>
      <div style={{ background: 'var(--color-bg-base)', border: '2px solid var(--color-border)', height: 14 }}>
        <div style={{ background: color, height: '100%', width: `${pct}%`, transition: 'width 0.2s' }} />
      </div>
    </div>
  );
}

function Row({ label, value, highlight, sub }: { label: string; value: string; highlight?: boolean; sub?: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '5px 0', borderBottom: 'var(--border-pixel)', gap: 8 }}>
      <span style={{ fontSize: 11, color: 'var(--color-ink)' }}>{label}{sub && <span style={{ color: 'var(--color-ink-muted)', fontSize: 10 }}> · {sub}</span>}</span>
      <span style={{ fontSize: 13, fontWeight: 700, color: highlight ? 'var(--color-accent-pink)' : undefined }}>{value}</span>
    </div>
  );
}

export function DpsCalculator() {
  const { stats, env } = useStatsStore();
  const [ingameDpsRaw, setIngameDpsRaw] = useState('');
  const ingameDps = parseGameNumber(ingameDpsRaw);

  const dps = useMemo(() => calcDps(stats, env), [stats, env]);
  const survival = useMemo(() => calcSurvival(stats), [stats]);

  const max = Math.max(dps.girl, dps.drone, dps.companion, 1);

  // 인게임 DPS 검증
  const validIngame = !isNaN(ingameDps) && ingameDps > 0;
  const diffPct = validIngame && dps.total > 0 ? ((dps.total - ingameDps) / ingameDps) * 100 : 0;
  const diffOk = Math.abs(diffPct) <= 10;

  const noStats = (stats.attack ?? 0) === 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {noStats && (
        <PixelCard title="⚠ 빌드 미입력">
          <p style={{ fontSize: 12, lineHeight: 1.7, margin: 0 }}>
            먼저 <Link to="/stats" style={{ color: 'var(--color-accent-pink)', fontWeight: 700 }}>내 빌드</Link> 페이지에서 인게임 33필드를 입력하세요.
          </p>
        </PixelCard>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
        <PixelCard title={<>DPS 분해 <PixelBadge variant={env.isBoss ? 'danger' : 'sky'}>{env.isBoss ? '보스' : '일반'}</PixelBadge></>}>
          <Bar label={`여고생 (${dps.girlPct.toFixed(0)}%)`} value={dps.girl} max={max} color="#F8AFC2" />
          <Bar label={`드론 (${dps.dronePct.toFixed(0)}%)`} value={dps.drone} max={max} color="#A8DADC" />
          <Bar label={`동료 (${dps.companionPct.toFixed(0)}%)`} value={dps.companion} max={max} color="#FFE08A" />
          <div style={{ marginTop: 10, padding: '8px 0', borderTop: '2px solid var(--color-border)' }}>
            <Row label="합산 DPS (사이트 추정)" value={formatGameNumber(dps.total)} highlight />
          </div>
        </PixelCard>

        <PixelCard title="인게임 DPS 검증">
          <PixelInput
            label="인게임 표기 합산 DPS"
            placeholder="예: 1.23T"
            value={ingameDpsRaw}
            onChange={(e) => setIngameDpsRaw(e.target.value)}
            hint="게임 화면의 'DPS' 표기값 (단위 K/M/G/T 가능)"
          />
          {validIngame && (
            <>
              <div style={{ height: 8 }} />
              <Row label="사이트 추정" value={formatGameNumber(dps.total)} />
              <Row label="인게임 표기" value={formatGameNumber(ingameDps)} />
              <Row label="차이" value={`${diffPct >= 0 ? '+' : ''}${diffPct.toFixed(1)}%`} highlight />
              <p style={{ fontSize: 10, color: diffOk ? 'var(--color-accent-mint)' : 'var(--color-danger)', marginTop: 6, fontWeight: 700, lineHeight: 1.6 }}>
                {diffOk ? '✓ ±10% 이내 일치 — 공식 신뢰도 OK' : '⚠ 차이 큼 — 드론/동료 기본 배수 추정치를 보정해야 할 수 있음'}
              </p>
            </>
          )}
        </PixelCard>

        <PixelCard title="생존력">
          <Row label="실효 HP" value={formatGameNumber(survival.effectiveHp)} highlight />
          <Row label="초당 회복" value={formatGameNumber(survival.effectiveRecoveryPerSec)} sub="0.5초당 ×2" />
          <Row label="회피율" value={`${survival.evasionPct.toFixed(0)}%`} />
        </PixelCard>

        <PixelCard title="여고생 세부 (Phase 3 데미지편)">
          <Row label="공격력" value={formatGameNumber(stats.attack ?? 0)} />
          <Row label="공격속도" value={`${stats.attackSpeed ?? 1}회/초`} />
          <Row label="치명타 확률" value={`${stats.critRate ?? 0}%`} />
          <Row label="치명타 피해량 (+50% 기본)" value={`+${stats.critDmg ?? 50}%`} />
        </PixelCard>

        <PixelCard title="드론 세부 (추정 모델)">
          <Row label="드론 공격력" value={formatGameNumber(stats.droneAttack ?? 0)} />
          <Row label="드론 치명 확률" value={`${stats.droneCritRate ?? 0}%`} />
          <Row label="드론 치명피해" value={`${stats.droneCritDmg ?? 0}%`} />
          <p style={{ fontSize: 10, color: 'var(--color-ink-muted)', marginTop: 6, lineHeight: 1.6 }}>
            ※ 드론 공격속도 1초/회 추정 (인게임 표기 시 사용자 보정 필요)
          </p>
        </PixelCard>

        <PixelCard title="동료 세부">
          <Row label="동료 공격력" value={formatGameNumber(stats.compAttack ?? 0)} />
          <Row label="동료 피해량" value={`${stats.compDmg ?? 100}%`} />
          <Row label="더블샷 확률" value={`${stats.compDoubleShot ?? 0}%`} />
          <Row label="동료 공격속도" value={`${stats.compAttackSpeed ?? 1}회/초`} />
        </PixelCard>
      </div>

      <PixelButton size="sm" variant="ghost">
        <Link to="/stats" style={{ color: 'inherit', textDecoration: 'none' }}>33필드 편집 →</Link>
      </PixelButton>

      <div style={{ fontSize: 10, color: 'var(--color-ink-muted)', lineHeight: 1.7 }}>
        ※ DPS는 비례 모델 — 공격력×피해율×치명기대×공속×더블샷 단순화. 절대값보다 변화율 신뢰도 높음.<br />
        ※ 드론·동료 기본 치명 배수는 1.5 추정. 인게임 합산 DPS와 ±10% 이상 차이나면 공식 보정 필요.<br />
        ※ 카드 효과는 인게임 합산값에 이미 반영되므로 별도 입력 불필요 (Phase 8+ 재계획 결정사항).
      </div>
    </div>
  );
}
