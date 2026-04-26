import { useState, useMemo } from 'react';
import {
  calcDiamondAllocation, calcBuffBep, calcReclimb,
  calcVipPackValue, calcRuneRoi, calcCostumeUpgrade,
  type RuneRoiInput, type CostumeUpgradeInput,
} from './formula';
import {
  DEFAULT_DIAMOND_INPUT, DEFAULT_BUFF_BEP_INPUT, DEFAULT_RECLIMB_INPUT,
  type DiamondAllocationInput, type BuffBepInput, type ReclimbInput, type ReclimbCandidate,
} from './types';
import { useStatsStore } from '@/store/statsStore';
import { formatGameNumber } from '@/lib/format/number';
import { PixelTabs, PixelCard, PixelInput, PixelBadge, PixelButton, PixelSelect } from '@/components/pixel';

const TABS = [
  { key: 'allocation', label: '다이아 N개 분배 ROI' },
  { key: 'bep', label: '신화 버프작 BEP' },
  { key: 'reclimb', label: '재등반 ROI 비교' },
  { key: 'packs', label: '패키지·환산' },
];

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: 'var(--border-pixel)' }}>
      <span style={{ fontSize: 11, color: 'var(--color-ink)' }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 700, color: highlight ? 'var(--color-accent-pink)' : undefined }}>{value}</span>
    </div>
  );
}

function AllocationTab() {
  const { env, assumptions } = useStatsStore();
  const [input, setInput] = useState<DiamondAllocationInput>({
    ...DEFAULT_DIAMOND_INPUT,
    goldPerMinMeasured: env.measuredGoldPerMin,
  });

  const setNum = (k: keyof DiamondAllocationInput, v: string) => {
    const n = parseFloat(v);
    setInput((p) => ({ ...p, [k]: isNaN(n) ? 0 : n }));
  };

  const result = useMemo(() => calcDiamondAllocation(input, assumptions), [input, assumptions]);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'start' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <PixelInput label="보유 다이아" type="number" value={input.diamonds === 0 ? '' : String(input.diamonds)} onChange={(e) => setNum('diamonds', e.target.value)} suffix="다이아" hint="비교할 다이아 양 (예: 1000)" />
        <PixelInput label="다이아 → 골드 환율 (다이아샵)" type="number" value={input.goldPerDiamondShop === 0 ? '' : String(input.goldPerDiamondShop)} onChange={(e) => setNum('goldPerDiamondShop', e.target.value)} suffix="골드/다이아" hint="0이면 골드 직구 카드 미노출" />
        <PixelInput label="광제 1일에 필요 다이아" type="number" value={input.premiumDaysPerDiamond === 0 ? '' : String(input.premiumDaysPerDiamond)} onChange={(e) => setNum('premiumDaysPerDiamond', e.target.value)} suffix="다이아/일" hint="광제 패키지 가격 ÷ 일수" />
        <PixelInput label="슬마팩 1일에 필요 다이아" type="number" value={input.slimePackDaysPerDiamond === 0 ? '' : String(input.slimePackDaysPerDiamond)} onChange={(e) => setNum('slimePackDaysPerDiamond', e.target.value)} suffix="다이아/일" />
        <PixelInput label="분당 측정 골드 (시간 가치)" type="number" value={input.goldPerMinMeasured === 0 ? '' : String(input.goldPerMinMeasured)} onChange={(e) => setNum('goldPerMinMeasured', e.target.value)} suffix="골드/분" hint="광제 시간 절약 가치 환산용" />
        <PixelButton size="sm" variant="ghost" onClick={() => setInput({ ...DEFAULT_DIAMOND_INPUT })}>초기화</PixelButton>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {result.cards.map((c, i) => (
          <PixelCard key={c.id} title={
            <>
              {i === 0 && c.roi > 0 && <PixelBadge variant="pink">BEST</PixelBadge>}{' '}{c.label}
            </>
          }>
            <Row label="환산량" value={`${formatGameNumber(c.amount)} ${c.unit}`} highlight />
            {c.roi > 0 && <Row label="ROI (다이아 가치)" value={`×${c.roi.toFixed(2)}`} />}
            <Row label="다이아당 단가" value={c.diamondPerUnit > 0 ? `${c.diamondPerUnit.toFixed(2)}` : '—'} />
            <p style={{ fontSize: 10, color: 'var(--color-ink-muted)', marginTop: 6, marginBottom: 0, lineHeight: 1.6 }}>{c.note}</p>
          </PixelCard>
        ))}
      </div>
    </div>
  );
}

function BepTab() {
  const { env, stats } = useStatsStore();
  const [input, setInput] = useState<BuffBepInput>({
    ...DEFAULT_BUFF_BEP_INPUT,
    currentGoldAcq: stats.goldAcq ?? 200,
    goldPerMinMeasured: env.measuredGoldPerMin || 200_000,
  });

  const setNum = (k: keyof BuffBepInput, v: string) => {
    const n = parseFloat(v);
    setInput((p) => ({ ...p, [k]: isNaN(n) ? 0 : n }));
  };

  const result = useMemo(() => calcBuffBep(input), [input]);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'start' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <PixelInput label="신화 버프 1회 비용" type="number" value={input.buffCostDiamond === 0 ? '' : String(input.buffCostDiamond)} onChange={(e) => setNum('buffCostDiamond', e.target.value)} suffix="다이아" hint="실제 신화 만드는 데 든 다이아 추정" />
        <PixelInput label="현재 골획 %" type="number" value={input.currentGoldAcq === 0 ? '' : String(input.currentGoldAcq)} onChange={(e) => setNum('currentGoldAcq', e.target.value)} suffix="%" hint="스펙창의 골드획득량 %" />
        <PixelInput label="분당 측정 골드" type="number" value={input.goldPerMinMeasured === 0 ? '' : String(input.goldPerMinMeasured)} onChange={(e) => setNum('goldPerMinMeasured', e.target.value)} suffix="골드/분" />
        <PixelInput label="버프 지속 시간" type="number" value={String(input.buffDurationMin)} onChange={(e) => setNum('buffDurationMin', e.target.value)} suffix="분" hint="신화=30분" />
        <PixelInput label="버프 효과 %" type="number" value={String(input.buffBonusPct)} onChange={(e) => setNum('buffBonusPct', e.target.value)} suffix="%p" hint="골획에 더하는 %p (신화=30)" />
      </div>

      <PixelCard title="버프 효과 분석">
        <Row label="최종값 증가율" value={`+${result.finalValueIncreasePct.toFixed(2)}%`} highlight />
        <Row label="버프 동안 추가 골드" value={formatGameNumber(result.extraGoldDuringBuff)} />
        <Row label="다이아당 추가 골드" value={result.goldPerDiamondCost > 0 ? formatGameNumber(result.goldPerDiamondCost) + '/다이아' : '—'} />
        <p style={{ fontSize: 10, color: 'var(--color-ink-muted)', marginTop: 8, lineHeight: 1.6 }}>{result.bepSummary}</p>
        <div style={{ marginTop: 8, fontSize: 10, color: 'var(--color-ink-muted)', lineHeight: 1.6 }}>
          ※ 신화 골획 효율은 현재 골획%가 높을수록 떨어짐 (200%→+15%, 400%→+7.5%)<br />
          ※ 재등반 시 골획이 낮을 때 버프 효율이 가장 높음 (Phase 4 골드획득下편 표 참고)
        </div>
      </PixelCard>
    </div>
  );
}

function ReclimbTab() {
  const [input, setInput] = useState<ReclimbInput>(DEFAULT_RECLIMB_INPUT);

  const updateCandidate = (id: string, key: keyof ReclimbCandidate, value: string | number) => {
    setInput((p) => ({
      ...p,
      candidates: p.candidates.map((c) =>
        c.id === id ? { ...c, [key]: typeof value === 'string' ? (parseFloat(value) || 0) : value } : c,
      ),
    }));
  };

  const result = useMemo(() => calcReclimb(input), [input]);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'start' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <p style={{ fontSize: 12, color: 'var(--color-ink-muted)', margin: 0, lineHeight: 1.7 }}>
          후보 층마다 인게임에서 측정한 분당 골드를 입력하세요. 시간당 환산 후 자동으로 순위 매김.
        </p>
        {input.candidates.map((c) => (
          <div key={c.id} style={{ padding: '10px', border: 'var(--border-pixel)', background: 'var(--color-bg-card)' }}>
            <PixelInput
              label={c.label}
              type="number"
              value={c.goldPerMin === 0 ? '' : String(c.goldPerMin)}
              onChange={(e) => updateCandidate(c.id, 'goldPerMin', e.target.value)}
              suffix="골드/분"
              placeholder="0"
            />
          </div>
        ))}
      </div>

      <PixelCard title="시간당 골드 비교">
        {result.ranked.length === 0 || result.ranked.every((c) => c.goldPerMin === 0) ? (
          <p style={{ fontSize: 12, color: 'var(--color-ink-muted)', margin: 0 }}>좌측에 후보 분당 골드를 입력하세요.</p>
        ) : (
          result.ranked.map((c) => (
            <Row
              key={c.id}
              label={`${c.rank}. ${c.label}`}
              value={c.goldPerMin > 0 ? `${formatGameNumber(c.goldPerHour)}/h` : '—'}
              highlight={c.rank === 1 && c.goldPerMin > 0}
            />
          ))
        )}
        {result.best && (
          <p style={{ fontSize: 11, color: 'var(--color-accent-pink)', marginTop: 8, fontWeight: 700 }}>
            추천: {result.best.label} ({formatGameNumber(result.best.goldPerMin * 60)}/h)
          </p>
        )}
      </PixelCard>
    </div>
  );
}

function PacksTab() {
  const { env } = useStatsStore();
  const [runeInput, setRuneInput] = useState<RuneRoiInput>({
    grade: '희귀', lockLevel: 1, expectedEffectPct: 1,
    goldPerMinMeasured: env.measuredGoldPerMin || 100_000,
  });
  const [costumeInput, setCostumeInput] = useState<CostumeUpgradeInput>({
    grade: 'R', currentLevel: 1, targetLevel: 10, ownedShards: 70,
  });

  const vip = useMemo(() => calcVipPackValue(), []);
  const runeR = useMemo(() => calcRuneRoi(runeInput), [runeInput]);
  const costumeR = useMemo(() => calcCostumeUpgrade(costumeInput), [costumeInput]);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 12 }}>
      {/* VIP팩 */}
      <PixelCard title={<>황금 VIP 팩 <PixelBadge variant="gold">30일</PixelBadge></>}>
        <Row label="가격" value={`₩${vip.priceWon.toLocaleString()}`} />
        <Row label="총 다이아 (매일+즉시)" value={`${vip.totalDia.toLocaleString()}`} />
        <Row label="뽑기권 100개 다이아 환산" value={`${vip.totalTicketValueDia.toLocaleString()}`} />
        <Row label="총 가치 (다이아)" value={`${vip.grandTotalDia.toLocaleString()}`} highlight />
        <Row label="일일 평균" value={`${vip.perDayDia.toFixed(0)}/일`} />
        <Row label="골획 +%" value={`+${vip.goldAcqBonusPct}%`} />
        <p style={{ fontSize: 10, color: 'var(--color-ink-muted)', marginTop: 6, lineHeight: 1.6 }}>
          매일 모든 던전 1회 추가 입장 + 마일리지 5%
        </p>
      </PixelCard>

      {/* 특성 룬 ROI */}
      <PixelCard title="특성 룬 ROI">
        <PixelSelect
          label="동료 등급"
          options={[
            { value: '일반', label: '일반' },
            { value: '희귀', label: '희귀' },
            { value: '영웅', label: '영웅' },
            { value: '전설', label: '전설' },
            { value: '신화', label: '신화' },
          ]}
          value={runeInput.grade}
          onChange={(e) => setRuneInput((p) => ({ ...p, grade: e.target.value as RuneRoiInput['grade'] }))}
        />
        <PixelInput label="잠금 단계 (1~5)" type="number" min={1} max={5} value={String(runeInput.lockLevel)} onChange={(e) => setRuneInput((p) => ({ ...p, lockLevel: parseInt(e.target.value) || 1 }))} />
        <PixelInput label="활성 시 효과 %" type="number" value={String(runeInput.expectedEffectPct)} onChange={(e) => setRuneInput((p) => ({ ...p, expectedEffectPct: parseFloat(e.target.value) || 0 }))} suffix="%" hint="예: 골획 +1%" />
        <PixelInput label="현재 분당 골드" type="number" value={String(runeInput.goldPerMinMeasured)} onChange={(e) => setRuneInput((p) => ({ ...p, goldPerMinMeasured: parseFloat(e.target.value) || 0 }))} suffix="골드/분" />
        <Row label="필요 룬" value={`${runeR.totalRunesNeeded}개`} highlight />
        <Row label="활성 시 분당 +" value={formatGameNumber(runeR.goldGainPerMinIfActive)} />
      </PixelCard>

      {/* 코스튬 강화 ROI */}
      <PixelCard title="코스튬 강화 ROI">
        <PixelSelect
          label="등급"
          options={[
            { value: 'R', label: 'R' }, { value: 'SR', label: 'SR' }, { value: 'SSR', label: 'SSR' },
          ]}
          value={costumeInput.grade}
          onChange={(e) => setCostumeInput((p) => ({ ...p, grade: e.target.value as CostumeUpgradeInput['grade'] }))}
        />
        <PixelInput label="현재 레벨" type="number" value={String(costumeInput.currentLevel)} onChange={(e) => setCostumeInput((p) => ({ ...p, currentLevel: parseInt(e.target.value) || 1 }))} />
        <PixelInput label="목표 레벨" type="number" value={String(costumeInput.targetLevel)} onChange={(e) => setCostumeInput((p) => ({ ...p, targetLevel: parseInt(e.target.value) || 1 }))} />
        <PixelInput label="보유 빛의파편" type="number" value={String(costumeInput.ownedShards)} onChange={(e) => setCostumeInput((p) => ({ ...p, ownedShards: parseInt(e.target.value) || 0 }))} suffix="개" hint="1레벨당 7개" />
        <Row label="필요 파편" value={`${costumeR.shardsNeeded}개`} />
        <Row label="가능 레벨" value={`${costumeR.levelsAchievable}레벨`} />
        <Row label="공격력 +%" value={`+${costumeR.attackGainPct.toFixed(1)}%`} highlight />
        <Row label="생명력 +%" value={`+${costumeR.hpGainPct.toFixed(1)}%`} />
      </PixelCard>

    </div>
  );
}

export function DecisionsCalculator() {
  const [tab, setTab] = useState('allocation');
  return (
    <>
      <PixelTabs tabs={TABS} active={tab} onChange={setTab} />
      <div style={{ paddingTop: 14 }}>
        {tab === 'allocation' && <AllocationTab />}
        {tab === 'bep' && <BepTab />}
        {tab === 'reclimb' && <ReclimbTab />}
        {tab === 'packs' && <PacksTab />}
      </div>
    </>
  );
}
