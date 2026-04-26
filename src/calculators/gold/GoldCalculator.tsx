import { useState, useMemo } from 'react';
import { calcGold, calcLightShard } from './formula';
import { DEFAULT_GOLD_INPUT, DEFAULT_LIGHT_SHARD_INPUT, type GoldInput, type LightShardInput } from './types';
import { formatGameNumber, parseGameNumber } from '@/lib/format/number';
import {
  PixelButton, PixelInput, PixelCard, PixelTabs,
  PixelCheckbox, PixelBadge,
} from '@/components/pixel';

const TABS = [
  { key: 'gold', label: '골드 효율' },
  { key: 'shard', label: '빛의파편' },
];

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: 'var(--border-pixel)' }}>
      <span style={{ fontSize: 11, color: 'var(--color-ink)' }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 700, color: highlight ? 'var(--color-accent-pink)' : undefined }}>{value}</span>
    </div>
  );
}

function DeltaBadge({ delta }: { delta: number }) {
  const positive = delta >= 0;
  return (
    <span style={{
      padding: '2px 6px',
      background: positive ? '#b6e2b6' : '#e57373',
      fontSize: 12, fontWeight: 700,
      border: '2px solid var(--color-border)',
    }}>
      {positive ? '+' : ''}{delta.toFixed(1)}%
    </span>
  );
}

function GoldTab() {
  const [input, setInput] = useState<GoldInput>(DEFAULT_GOLD_INPUT);
  const [goldRaw, setGoldRaw] = useState('');

  const setNum = (key: keyof GoldInput, val: string) => {
    const n = parseFloat(val);
    setInput((p) => ({ ...p, [key]: isNaN(n) ? 0 : n }));
  };

  const result = useMemo(() => calcGold(input), [input]);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'start' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <PixelInput
          label="현재 분당 골드 획득량"
          placeholder="절전모드 수치 또는 측정값 (예: 200K)"
          value={goldRaw}
          onChange={(e) => {
            setGoldRaw(e.target.value);
            const n = parseGameNumber(e.target.value);
            setInput((p) => ({ ...p, currentGoldPerMin: isNaN(n) ? 0 : n }));
          }}
          hint="게임 절전모드 화면의 골드/분 수치 입력"
        />
        <div style={{ padding: '8px 0', fontWeight: 700, fontSize: 12, borderBottom: 'var(--border-pixel)' }}>현재 수치</div>
        <PixelInput label="골드 획득량 증가 %" value={input.goldAcqBonus === 0 ? '' : String(input.goldAcqBonus)} onChange={(e) => setNum('goldAcqBonus', e.target.value)} suffix="%" hint="스펙창 → 골드획득량 증가" type="number" />
        <PixelInput label="전체 골드 획득량 증가 %" value={input.totalGoldBonus === 0 ? '' : String(input.totalGoldBonus)} onChange={(e) => setNum('totalGoldBonus', e.target.value)} suffix="%" hint="명상/로얄핫타임 포함" type="number" />
        <div style={{ padding: '8px 0', fontWeight: 700, fontSize: 12, borderBottom: 'var(--border-pixel)', marginTop: 8 }}>목표 수치</div>
        <PixelInput label="목표 골드 획득량 증가 %" value={input.targetGoldAcqBonus === 0 ? '' : String(input.targetGoldAcqBonus)} onChange={(e) => setNum('targetGoldAcqBonus', e.target.value)} suffix="%" type="number" />
        <PixelInput label="목표 전체 골드 획득량 증가 %" value={input.targetTotalGoldBonus === 0 ? '' : String(input.targetTotalGoldBonus)} onChange={(e) => setNum('targetTotalGoldBonus', e.target.value)} suffix="%" type="number" />
        <PixelInput label="1일 사냥 시간" value={input.hoursPerDay === 0 ? '' : String(input.hoursPerDay)} onChange={(e) => setNum('hoursPerDay', e.target.value)} suffix="시간" type="number" hint="24 = 풀방치" />
        <PixelButton size="sm" variant="ghost" onClick={() => { setInput(DEFAULT_GOLD_INPUT); setGoldRaw(''); }}>초기화</PixelButton>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <PixelCard title={<>변화량 <DeltaBadge delta={result.deltaPercent} /></>}>
          <Row label="현재 골드 배율" value={`×${result.currentMultiplier.toFixed(3)}`} />
          <Row label="목표 골드 배율" value={`×${result.targetMultiplier.toFixed(3)}`} />
          <Row label="배율 변화" value={`${result.changeRatio.toFixed(4)}배`} highlight />
        </PixelCard>

        <PixelCard title="현재 골드 획득량">
          <Row label="분당" value={formatGameNumber(result.currentPerMin)} />
          <Row label="시간당" value={formatGameNumber(result.currentPerHour)} />
          <Row label="1일" value={formatGameNumber(result.currentPerDay)} />
          <Row label="1주" value={formatGameNumber(result.currentPerWeek)} />
        </PixelCard>

        <PixelCard title="목표 후 예측 획득량">
          <Row label="분당" value={formatGameNumber(result.targetPerMin)} />
          <Row label="시간당" value={formatGameNumber(result.targetPerHour)} />
          <Row label="1일" value={formatGameNumber(result.targetPerDay)} />
          <Row label="1주" value={formatGameNumber(result.targetPerWeek)} />
        </PixelCard>

        <div style={{ fontSize: 10, color: 'var(--color-ink-muted)', lineHeight: 1.6 }}>
          ※ 층별 기본 골드값 미확인 → 현재 분당 골드 측정값 기반 비율 계산<br />
          ※ 공식: floor(floor(기본값 × 골획%) × 전골획%)<br />
          ※ 출처: 네이버 라운지 골드획득上/下편 (YUI, 2026-04)
        </div>
      </div>
    </div>
  );
}

function LightShardTab() {
  const [input, setInput] = useState<LightShardInput>(DEFAULT_LIGHT_SHARD_INPUT);

  const setNum = (key: keyof LightShardInput, val: string) => {
    const n = parseFloat(val);
    setInput((p) => ({ ...p, [key]: isNaN(n) ? 0 : n }));
  };
  const setBool = (key: keyof LightShardInput, val: boolean) => {
    setInput((p) => ({ ...p, [key]: val }));
  };

  const result = useMemo(() => calcLightShard(input), [input]);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'start' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <PixelInput label="평균 합성 슬라임 레벨" value={String(input.avgSlimeLevel)} onChange={(e) => setNum('avgSlimeLevel', e.target.value)} type="number" hint="n레벨 탄생 → n²개 파편. 주로 10~15레벨" />
        <PixelCheckbox label="연구소 빛의파편 증가 연구 완료 (+30%)" checked={input.hasResearchBonus} onChange={(e) => setBool('hasResearchBonus', e.target.checked)} />
        <PixelCheckbox label="슬라임 마스터 팩 구매 (×2)" checked={input.hasMasterPack} onChange={(e) => setBool('hasMasterPack', e.target.checked)} />
        <PixelInput label="1일 무료 달빛" value={String(input.dailyFreeMoonlight)} onChange={(e) => setNum('dailyFreeMoonlight', e.target.value)} type="number" hint="기본 150 (기본지급50 + 무료충전100). 달빛주머니 업그레이드 시 더 많음" />
        <PixelInput label="기간 (일)" value={String(input.days)} onChange={(e) => setNum('days', e.target.value)} type="number" suffix="일" />
        <PixelInput label="달빛 충전 횟수 (기간 내)" value={input.moonlightCharges === 0 ? '' : String(input.moonlightCharges)} onChange={(e) => setNum('moonlightCharges', e.target.value)} type="number" suffix="회" hint="1회 = 300다이아 = 100달빛" />
        <PixelInput label="새식구 확률" value={input.newMemberRate === 0 ? '' : String(input.newMemberRate)} onChange={(e) => setNum('newMemberRate', e.target.value)} type="number" suffix="%" hint="0이면 미업그레이드" />
        <PixelButton size="sm" variant="ghost" onClick={() => setInput(DEFAULT_LIGHT_SHARD_INPUT)}>초기화</PixelButton>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <PixelCard title={<>빛의파편 획득 <PixelBadge variant="sky">×{result.multiplier.toFixed(1)}</PixelBadge></>}>
          <Row label="합성 1회당 파편" value={`${result.shardPerSynthesis.toFixed(1)}개`} />
          <Row label="총 달빛" value={`${result.totalMoonlight.toLocaleString()}`} />
          <Row label="총 소환 횟수" value={`${result.totalSummons.toLocaleString()}회`} />
          <Row label="총 합성 횟수" value={`${result.totalSynth.toLocaleString()}회`} />
          <Row label="총 빛의파편" value={`${result.totalShards.toLocaleString()}개`} highlight />
        </PixelCard>

        {input.moonlightCharges > 0 && (
          <PixelCard title="달빛 충전 효율 (다이아 환산)">
            <Row label="투자 다이아" value={`${result.diamondInvested.toLocaleString()}`} />
            <Row label="합성보상 횟수" value={`${result.rewardCount}회`} />
            <Row label="뽑기권 획득" value={`${result.ticketsReturned}개`} />
            <Row label="다이아 직접 획득" value={`${result.diamondFromReward.toLocaleString()}`} />
            <Row label="예상 회수 다이아" value={`${result.diamondReturned.toLocaleString()}`} />
            <Row label="수익률" value={`×${result.roi.toFixed(2)} (${((result.roi - 1) * 100).toFixed(1)}%)`} highlight />
          </PixelCard>
        )}

        <div style={{ fontSize: 10, color: 'var(--color-ink-muted)', lineHeight: 1.6 }}>
          ※ 빛의파편: 합성 n레벨 슬라임 탄생 = n²개<br />
          ※ 달빛 충전 효율: 100달빛→97합성→약 1.94보상→1.16배 다이아 기댓값<br />
          ※ 합성보상 4종 순환 (50다이아/장비3/스킬3/동료3 뽑기권)<br />
          ※ 출처: 빛의파편수급편/슬라임합성보상편 (YUI, 2026-03)
        </div>
      </div>
    </div>
  );
}

export function GoldCalculator() {
  const [tab, setTab] = useState('gold');

  return (
    <>
      <PixelTabs tabs={TABS} active={tab} onChange={setTab} />
      <div style={{ paddingTop: 14 }}>
        {tab === 'gold' ? <GoldTab /> : <LightShardTab />}
      </div>
    </>
  );
}
