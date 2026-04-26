import { useState, useMemo } from 'react';
import { calcInstantOpen, calcBernoulli } from './formula';
import {
  DEFAULT_INSTANT_INPUT, DEFAULT_BERNOULLI_INPUT,
  type InstantOpenInput, type BernoulliInput,
} from './types';
import { formatPct } from '@/lib/format/number';
import { CHEST_TYPES } from '@/data/chests';
import {
  PixelButton, PixelInput, PixelCard, PixelTabs,
  PixelSelect, PixelCheckbox, PixelBadge,
} from '@/components/pixel';

const TABS = [
  { key: 'instant', label: '즉시 개봉 가성비' },
  { key: 'ev', label: 'N회 개봉 EV' },
];

const CHEST_OPTIONS = CHEST_TYPES.map((c) => ({ value: c.id, label: c.name }));

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: 'var(--border-pixel)' }}>
      <span style={{ fontSize: 11, color: 'var(--color-ink)' }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 700, color: highlight ? 'var(--color-accent-pink)' : undefined }}>{value}</span>
    </div>
  );
}

function InstantTab() {
  const [input, setInput] = useState<InstantOpenInput>(DEFAULT_INSTANT_INPUT);

  const result = useMemo(() => calcInstantOpen(input), [input]);
  const chest = CHEST_TYPES.find((c) => c.id === input.chestId)!;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'start' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <PixelSelect
          label="상자 종류"
          options={CHEST_OPTIONS}
          value={input.chestId}
          onChange={(e) => setInput((p) => ({ ...p, chestId: e.target.value as InstantOpenInput['chestId'] }))}
        />
        <PixelCheckbox
          label="광고제거(광제) 보유 — 30분 단축"
          checked={input.hasPremium}
          onChange={(e) => setInput((p) => ({ ...p, hasPremium: e.target.checked }))}
        />
        <PixelInput
          label="즉시 개봉 다이아"
          value={input.instantDiamond === 0 ? '' : String(input.instantDiamond)}
          onChange={(e) => setInput((p) => ({ ...p, instantDiamond: parseFloat(e.target.value) || 0 }))}
          type="number" suffix="다이아"
          hint={`게임 내 즉시 개봉 버튼 다이아 (전설=150)`}
        />
        <PixelInput
          label="광고 시청 후 다이아"
          value={input.adDiamond < 0 ? '' : String(input.adDiamond)}
          onChange={(e) => {
            const v = e.target.value;
            setInput((p) => ({ ...p, adDiamond: v === '' ? -1 : (parseFloat(v) || 0) }));
          }}
          type="number" suffix="다이아"
          hint="광고 옵션 없으면 비워두기. 0이면 광고만 보면 무료"
        />
        <PixelInput
          label="다이아 시간 가치"
          value={String(input.timeValuePerMin)}
          onChange={(e) => setInput((p) => ({ ...p, timeValuePerMin: parseFloat(e.target.value) || 0 }))}
          type="number" suffix="다이아/분"
          hint="기본 2 (연구/상자 시간단축 기준 시세)"
        />
        <PixelButton size="sm" variant="ghost" onClick={() => setInput(DEFAULT_INSTANT_INPUT)}>초기화</PixelButton>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <PixelCard title={<>{chest.name} 분석 <PixelBadge variant={result.instantWorthIt || result.adWorthIt ? 'pink' : 'sky'}>{result.recommendation}</PixelBadge></>}>
          <Row label="자연 해제 시간" value={`${chest.openMinutes}분`} />
          <Row label="실효 해제 시간 (광제 반영)" value={`${result.effectiveOpenMinutes}분`} />
          <Row label="자연 대기 시간 가치" value={`${result.naturalWaitDiamondCost.toFixed(0)}다이아`} />
          <Row label="즉시 개봉 비용" value={`${input.instantDiamond}다이아`} />
          {input.adDiamond >= 0 && <Row label="광고 후 비용" value={`${input.adDiamond}다이아`} />}
        </PixelCard>

        <PixelCard title="판단 근거">
          <Row label="즉시 개봉 ≤ 시간 가치?" value={result.instantWorthIt ? 'YES (이득)' : 'NO (손해)'} highlight={result.instantWorthIt} />
          {input.adDiamond >= 0 && (
            <Row label="광고 후 ≤ 시간 가치?" value={result.adWorthIt ? 'YES (이득)' : 'NO'} highlight={result.adWorthIt} />
          )}
        </PixelCard>

        <div style={{ fontSize: 10, color: 'var(--color-ink-muted)', lineHeight: 1.6 }}>
          ※ 상자칸이 가득찼다면 즉시 개봉으로 새 상자 자리 확보 (등반 상자 꿀팁)<br />
          ※ 출처: 상자편(YUI), 등반 상자 심화 꿀팁(모룸, 2026-03-06)
        </div>
      </div>
    </div>
  );
}

function EvTab() {
  const [input, setInput] = useState<BernoulliInput>(DEFAULT_BERNOULLI_INPUT);

  const setNum = (k: keyof BernoulliInput, v: string) => {
    const n = parseFloat(v);
    setInput((p) => ({ ...p, [k]: isNaN(n) ? 0 : n }));
  };

  const result = useMemo(() => calcBernoulli(input), [input]);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'start' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <PixelInput
          label="개봉 횟수 (N)"
          value={input.chestCount === 0 ? '' : String(input.chestCount)}
          onChange={(e) => setNum('chestCount', e.target.value)}
          type="number" suffix="회"
          hint="보유 상자/뽑기권/키 수"
        />
        <PixelInput
          label="1회 목표 확률 (p)"
          value={input.targetProbability === 0 ? '' : String(input.targetProbability)}
          onChange={(e) => setNum('targetProbability', e.target.value)}
          type="number" suffix="%"
          hint="1회 개봉 시 목표 보상이 나올 확률 (예: 전설 5%)"
        />
        <PixelInput
          label="몬테카를로 시뮬 횟수"
          value={String(input.trials)}
          onChange={(e) => setNum('trials', e.target.value)}
          type="number" suffix="회"
          hint="시드=42 고정 (재현 가능). 1만~10만 권장"
        />
        <PixelButton size="sm" variant="ghost" onClick={() => setInput(DEFAULT_BERNOULLI_INPUT)}>초기화</PixelButton>
        <div style={{ fontSize: 10, color: 'var(--color-ink-muted)', marginTop: 4, lineHeight: 1.6 }}>
          ※ 천장(피티) 시스템이 있는 상자에는 부정확<br />
          ※ 단순 베르누이 가정 (각 시도 독립)
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <PixelCard title="이항분포 결과 (이론값)">
          <Row label="1개 이상 획득 확률" value={formatPct(result.probAtLeastOne * 100)} highlight />
          <Row label="기댓값 E[X]" value={`${result.expectedDrops.toFixed(2)}개`} />
          <Row label="표준편차 σ" value={`${result.stdDev.toFixed(2)}`} />
        </PixelCard>

        <PixelCard title="P(X = k) 분포">
          {result.prob0to5.map((p, i) => (
            <Row key={i} label={`P(X = ${i})`} value={formatPct(p * 100)} />
          ))}
        </PixelCard>

        <PixelCard title="몬테카를로 시뮬레이션 결과">
          <Row label="시드" value={`${result.monteCarlo.seed}`} />
          <Row label="시뮬 평균" value={`${result.monteCarlo.mean.toFixed(3)}개`} />
          <Row label="시뮬 P(X ≥ 1)" value={formatPct(result.monteCarlo.p1 * 100)} />
        </PixelCard>
      </div>
    </div>
  );
}

export function ChestCalculator() {
  const [tab, setTab] = useState('instant');
  return (
    <>
      <PixelTabs tabs={TABS} active={tab} onChange={setTab} />
      <div style={{ paddingTop: 14 }}>
        {tab === 'instant' ? <InstantTab /> : <EvTab />}
      </div>
    </>
  );
}
