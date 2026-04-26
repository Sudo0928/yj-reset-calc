import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { calcCompare } from './formula';
import { useStatsStore } from '@/store/statsStore';
import { StatsForm } from '@/components/stats/StatsForm';
import { encodeCompare, decodeCompare, type BuildSnapshot } from '@/lib/storage/buildShareUrl';
import { DEFAULT_STATS, DEFAULT_ENV, type EnvInput } from '@/data/statsSchema';
import { formatGameNumber } from '@/lib/format/number';
import { PixelButton, PixelCard, PixelInput, PixelBadge, PixelSelect, useToast } from '@/components/pixel';
import { WORLD_STAGE_OPTIONS } from '@/data/worldLimits';

function Row({ label, value, highlight, sub }: { label: string; value: string; highlight?: boolean; sub?: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', padding: '5px 0', borderBottom: 'var(--border-pixel)', gap: 8 }}>
      <span style={{ fontSize: 11, color: 'var(--color-ink)' }}>{label}{sub && <span style={{ color: 'var(--color-ink-muted)', fontSize: 10 }}> · {sub}</span>}</span>
      <span style={{ fontSize: 13, fontWeight: 700, color: highlight ? 'var(--color-accent-pink)' : undefined, whiteSpace: 'nowrap' }}>{value}</span>
    </div>
  );
}

function DiffBadge({ diff, suffix = '' }: { diff: number; suffix?: string }) {
  const positive = diff > 0;
  const zero = Math.abs(diff) < 0.01;
  return (
    <span style={{
      padding: '2px 6px',
      background: zero ? '#ddd' : positive ? '#b6e2b6' : '#e57373',
      fontSize: 11, fontWeight: 700,
      border: '2px solid var(--color-border)',
    }}>
      {zero ? '0' : positive ? '+' : ''}{diff.toFixed(suffix === '%' ? 1 : 2)}{suffix}
    </span>
  );
}

export function CompareCalculator() {
  const { stats: storeStats, env: storeEnv } = useStatsStore();
  const { toast } = useToast();
  const [params, setParams] = useSearchParams();

  const [left, setLeft] = useState<BuildSnapshot>({ stats: storeStats, env: storeEnv });
  const [right, setRight] = useState<BuildSnapshot>({ stats: storeStats, env: storeEnv });
  const [rawValues, setRawValues] = useState<Record<string, string>>({});
  const [hoursPerDay, setHoursPerDay] = useState(24);

  // URL ?b= 파라미터 디코딩 (1회)
  useEffect(() => {
    const b = params.get('b');
    if (!b) return;
    const decoded = decodeCompare(b);
    if (decoded) {
      setLeft(decoded.l);
      setRight(decoded.r);
      toast('공유 URL에서 빌드 로드됨', 'success');
    } else {
      toast('공유 URL 디코딩 실패', 'error');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setRightStat = (key: string, value: number) => {
    setRight((r) => ({ ...r, stats: { ...r.stats, [key]: value } }));
  };
  const setRightEnv = <K extends keyof EnvInput>(key: K, value: EnvInput[K]) => {
    setRight((r) => ({ ...r, env: { ...r.env, [key]: value } }));
  };
  const setRaw = (key: string, raw: string) => setRawValues((r) => ({ ...r, [key]: raw }));

  const { assumptions } = useStatsStore();
  const result = useMemo(
    () => calcCompare({ left, right, hoursPerDay }, assumptions),
    [left, right, hoursPerDay, assumptions],
  );

  const handleLoadFromStore = () => {
    setLeft({ stats: storeStats, env: storeEnv });
    toast('내 빌드를 좌측에 로드함', 'success');
  };

  const handleCopyLeftToRight = () => {
    setRight({ stats: { ...left.stats }, env: { ...left.env } });
    setRawValues({});
    toast('좌측 빌드를 우측에 복사', 'success');
  };

  const handleResetRight = () => {
    setRight({ stats: DEFAULT_STATS, env: DEFAULT_ENV });
    setRawValues({});
  };

  const handleShare = async () => {
    const encoded = encodeCompare({ v: 1, l: left, r: right });
    setParams({ b: encoded });
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      toast('공유 URL 클립보드 복사 완료', 'success');
    } catch {
      toast(`URL: ${url.slice(0, 50)}...`, 'success');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {/* ─── 좌·우 빌드 헤더 ─── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <PixelCard title={<>좌 (현재) <PixelBadge variant="sky">Before</PixelBadge></>}>
          <Row label="공격력" value={formatGameNumber(left.stats.attack ?? 0)} />
          <Row label="치명타 확률" value={`${(left.stats.critRate ?? 0).toFixed(0)}%`} />
          <Row label="모든 피해량" value={`${(left.stats.allDmgInc ?? 100).toFixed(0)}%`} />
          <Row label="골획" value={`${(left.stats.goldAcq ?? 100).toFixed(0)}%`} />
          <Row label="전골획" value={`${(left.stats.totalGoldAcq ?? 100).toFixed(0)}%`} />
          <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
            <PixelButton size="sm" variant="primary" onClick={handleLoadFromStore}>내 빌드 로드</PixelButton>
            <Link to="/stats"><PixelButton size="sm" variant="ghost">/stats 편집</PixelButton></Link>
          </div>
        </PixelCard>

        <PixelCard title={<>우 (가정) <PixelBadge variant="pink">After</PixelBadge></>}>
          <Row label="공격력" value={formatGameNumber(right.stats.attack ?? 0)} />
          <Row label="치명타 확률" value={`${(right.stats.critRate ?? 0).toFixed(0)}%`} />
          <Row label="모든 피해량" value={`${(right.stats.allDmgInc ?? 100).toFixed(0)}%`} />
          <Row label="골획" value={`${(right.stats.goldAcq ?? 100).toFixed(0)}%`} />
          <Row label="전골획" value={`${(right.stats.totalGoldAcq ?? 100).toFixed(0)}%`} />
          <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
            <PixelButton size="sm" variant="primary" onClick={handleCopyLeftToRight}>← 좌측 복사</PixelButton>
            <PixelButton size="sm" variant="ghost" onClick={handleResetRight}>초기화</PixelButton>
            <PixelButton size="sm" variant="primary" onClick={handleShare}>공유 URL</PixelButton>
          </div>
        </PixelCard>
      </div>

      {/* ─── 결과 패널 ─── */}
      <PixelCard title={<>결과 차이 <DiffBadge diff={result.dpsDiffPct} suffix="%" /></>}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 10 }}>
          <div>
            <Row label="좌 종합 DPS" value={formatGameNumber(result.leftDps.total)} />
            <Row label="우 종합 DPS" value={formatGameNumber(result.rightDps.total)} />
            <Row label="DPS 차이" value={formatGameNumber(result.dpsDiff)} sub={`${result.dpsDiffPct.toFixed(1)}%`} highlight />
            <div style={{ fontSize: 10, color: 'var(--color-ink-muted)', marginTop: 4 }}>
              여고생 {result.rightDps.girlPct.toFixed(0)}% / 드론 {result.rightDps.dronePct.toFixed(0)}% / 동료 {result.rightDps.companionPct.toFixed(0)}%
            </div>
          </div>
          <div>
            <Row label="좌 시간당 골드" value={formatGameNumber(result.leftGoldHr)} />
            <Row label="우 시간당 골드" value={formatGameNumber(result.rightGoldHr)} />
            <Row label="골드 차이/h" value={formatGameNumber(result.goldHrDiff)} sub={`${result.goldHrDiffPct.toFixed(1)}%`} highlight />
          </div>
          <div>
            <Row label="좌 실효 HP" value={formatGameNumber(result.leftHp)} />
            <Row label="우 실효 HP" value={formatGameNumber(result.rightHp)} />
            <Row label="HP 차이" value={formatGameNumber(result.hpDiff)} sub={`${result.hpDiffPct.toFixed(1)}%`} highlight />
          </div>
        </div>
      </PixelCard>

      {/* ─── 효과 카테고리 차이 ─── */}
      <PixelCard title="효과 카테고리 차이">
        {result.effectDiffs.map((e) => (
          <Row
            key={e.key}
            label={e.label}
            value={`${e.left.toFixed(0)}% → ${e.right.toFixed(0)}%`}
            sub={e.diff !== 0 ? `${e.diff > 0 ? '+' : ''}${e.diff.toFixed(0)}%p` : ''}
          />
        ))}
      </PixelCard>

      {/* ─── 민감도 top 5 ─── */}
      {result.sensitivityTop5.length > 0 && (
        <PixelCard title="민감도 Top 5 (좌 빌드 기준 +1% 시 변화)">
          {result.sensitivityTop5.map((s) => (
            <div key={s.key} style={{ marginBottom: 6 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 2 }}>
                <span>{s.label}</span>
                <span style={{ fontWeight: 700 }}>DPS +{s.dpsDeltaPct.toFixed(2)}% / 골드 +{s.goldDeltaPct.toFixed(2)}%</span>
              </div>
            </div>
          ))}
        </PixelCard>
      )}

      {/* ─── 우측 빌드 편집 폼 ─── */}
      <PixelCard title="우측 빌드 편집">
        <div style={{ marginBottom: 10, display: 'flex', gap: 10, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <PixelInput
            label="1일 사냥 시간"
            type="number"
            value={String(hoursPerDay)}
            onChange={(e) => setHoursPerDay(parseFloat(e.target.value) || 0)}
            suffix="시간"
            style={{ minWidth: 120 }}
          />
          <PixelSelect
            label="우측 월드 단계"
            options={WORLD_STAGE_OPTIONS}
            value={String(right.env.worldStage)}
            onChange={(e) => setRightEnv('worldStage', parseInt(e.target.value))}
            style={{ minWidth: 160 }}
          />
          <PixelInput
            label="우측 분당 측정 골드"
            type="number"
            value={right.env.measuredGoldPerMin === 0 ? '' : String(right.env.measuredGoldPerMin)}
            onChange={(e) => setRightEnv('measuredGoldPerMin', parseFloat(e.target.value) || 0)}
            suffix="골드/분"
            style={{ minWidth: 160 }}
          />
        </div>
        <StatsForm stats={right.stats} setStat={setRightStat} rawValues={rawValues} setRaw={setRaw} />
      </PixelCard>

      <div style={{ fontSize: 10, color: 'var(--color-ink-muted)', lineHeight: 1.7 }}>
        ※ DPS 공식은 단순화된 비례 모델 (스킬 발동 빈도·드론 공속 추정치). 절대값보다 빌드 변경 시 변화율에 신뢰성이 높음.<br />
        ※ 시간당 골드는 측정값 모드 기준 (좌·우 측정값을 모두 입력해야 의미있는 비교).<br />
        ※ 공유 URL은 base64 인코딩 — 새 탭에서 열면 동일 빌드 복원.
      </div>
    </div>
  );
}
