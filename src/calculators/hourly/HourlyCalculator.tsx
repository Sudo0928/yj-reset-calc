import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { calcHourly } from './formula';
import type { GoldMode } from './types';
import { useStatsStore } from '@/store/statsStore';
import { formatGameNumber } from '@/lib/format/number';
import { PixelTabs, PixelCard, PixelInput, PixelBadge, PixelButton } from '@/components/pixel';

const MODE_TABS = [
  { key: 'measured', label: '측정값 모드' },
  { key: 'dps', label: 'DPS×처치수 모드' },
];

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: 'var(--border-pixel)' }}>
      <span style={{ fontSize: 11, color: 'var(--color-ink)' }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 700, color: highlight ? 'var(--color-accent-pink)' : undefined }}>{value}</span>
    </div>
  );
}

export function HourlyCalculator() {
  const { stats, env, assumptions } = useStatsStore();
  const [mode, setMode] = useState<GoldMode>('measured');
  const [hoursPerDay, setHoursPerDay] = useState(24);

  const result = useMemo(
    () => calcHourly({ stats, env, mode, hoursPerDay }, assumptions),
    [stats, env, mode, hoursPerDay, assumptions],
  );

  // "측정값 없음" 판정: 두 모드 모두 입력 0인 경우만 (default 100% 유지해도 빌드 입력 가능)
  const noStats = env.measuredGoldPerMin === 0 && (env.killsPerMin === 0 || env.goldPerKill === 0);

  return (
    <div>
      {noStats && (
        <PixelCard title="⚠ 빌드 미입력">
          <p style={{ fontSize: 12, lineHeight: 1.7, margin: 0 }}>
            먼저 <Link to="/stats" style={{ color: 'var(--color-accent-pink)', fontWeight: 700 }}>내 빌드</Link> 페이지에서 인게임 스펙창의 33개 수치와 측정값을 입력하세요.
          </p>
        </PixelCard>
      )}

      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', flexWrap: 'wrap', marginTop: 14, marginBottom: 12 }}>
        <PixelInput
          label="1일 사냥 시간"
          type="number"
          value={String(hoursPerDay)}
          onChange={(e) => setHoursPerDay(parseFloat(e.target.value) || 0)}
          suffix="시간"
          hint="24 = 풀방치"
          style={{ minWidth: 140 }}
        />
        <Link to="/stats">
          <PixelButton size="sm" variant="ghost">빌드 편집 →</PixelButton>
        </Link>
      </div>

      <PixelTabs tabs={MODE_TABS} active={mode} onChange={(k) => setMode(k as GoldMode)} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12, marginTop: 14 }}>
        {/* 골드 */}
        <PixelCard title={<>골드 <PixelBadge variant={mode === 'measured' ? 'sky' : 'pink'}>{mode === 'measured' ? '측정' : 'DPS'}</PixelBadge></>}>
          <Row label="분당" value={formatGameNumber(result.goldPerMin)} />
          <Row label="시간당" value={formatGameNumber(result.goldPerHour)} />
          <Row label="1일" value={formatGameNumber(result.goldPerDay)} highlight />
          <Row label="1주" value={formatGameNumber(result.goldPerWeek)} />
          <Row label="30일" value={formatGameNumber(result.goldPer30Day)} />
          <p style={{ fontSize: 10, color: 'var(--color-ink-muted)', marginTop: 6, marginBottom: 0, lineHeight: 1.6 }}>
            {result.goldNote}
          </p>
        </PixelCard>

        {/* 빛의파편 */}
        <PixelCard title={<>빛의파편 <PixelBadge variant="sky">×{result.shardMultiplier.toFixed(2)}</PixelBadge></>}>
          <Row label="합성 1회당" value={`${result.shardPerSynthesis.toFixed(0)}개`} />
          <Row label="시간당 (4회 합성 가정)" value={`${formatGameNumber(result.shardPerHour)}개`} />
          <Row label="1일" value={`${formatGameNumber(result.shardPerDay)}개`} highlight />
          <Row label="1주" value={`${formatGameNumber(result.shardPerWeek)}개`} />
          <p style={{ fontSize: 10, color: 'var(--color-ink-muted)', marginTop: 6, marginBottom: 0, lineHeight: 1.6 }}>
            슬라임 합성 빈도는 시간당 4회 가정 (사용자 보정 필요)
          </p>
        </PixelCard>

        {/* 연구 시간 */}
        <PixelCard title="연구 회전">
          <Row label="연구시간감소%" value={`${result.researchTimeRedPct.toFixed(0)}%`} />
          <Row label="실효 1시간 가치" value={`${result.researchHoursPer1h.toFixed(2)}h`} highlight />
          <p style={{ fontSize: 10, color: 'var(--color-ink-muted)', marginTop: 6, marginBottom: 0 }}>
            감소 50% → 1시간이 2시간 가치
          </p>
        </PixelCard>

        {/* 방치 보상 */}
        <PixelCard title="방치 보상">
          <Row label="방치보상시간%" value={`${(result.idleRewardMultiplier * 100).toFixed(0)}%`} />
          <Row label="24시간 실효 가치" value={`${result.idleRewardHoursValue.toFixed(1)}h`} highlight />
        </PixelCard>
      </div>

      {/* 누적 시뮬 */}
      <PixelCard title="누적 시뮬 (체크포인트)">
        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr 1fr', gap: '4px 12px', fontSize: 11 }}>
          <div style={{ fontWeight: 700, color: 'var(--color-ink-muted)' }}>시점</div>
          <div style={{ fontWeight: 700, color: 'var(--color-ink-muted)' }}>골드</div>
          <div style={{ fontWeight: 700, color: 'var(--color-ink-muted)' }}>빛의파편</div>
          {result.cumulative.map((c) => (
            <div key={c.hour} style={{ display: 'contents' }}>
              <div>{c.hour}h{c.hour >= 24 ? ` (${c.hour / 24}일)` : ''}</div>
              <div style={{ fontWeight: 700 }}>{formatGameNumber(c.gold)}</div>
              <div>{formatGameNumber(c.shard)}</div>
            </div>
          ))}
        </div>
      </PixelCard>

      <div style={{ marginTop: 12, fontSize: 10, color: 'var(--color-ink-muted)', lineHeight: 1.7 }}>
        ※ 측정값 모드: 분당 골드를 사용자가 직접 측정해 입력 (가장 정확). 골획%/전골획% 변경 시 비율 보정은 별도.<br />
        ※ DPS 모드: 사용자가 입력한 분당 처치수 × 몹당 골드 × 골획×전골획 (게임 데이터 부재로 사용자 측정 필요)<br />
        ※ 모든 수치는 추정치이며 인게임과 ±5~10% 오차 가능
      </div>
    </div>
  );
}
