import { useState, useMemo, useCallback } from 'react';
import { calcDamage } from './formula';
import { DEFAULT_INPUT, type DamageInput } from './types';
import { formatGameNumber, formatPct, parseGameNumber } from '@/lib/format/number';
import { WORLD_STAGE_OPTIONS } from '@/data/worldLimits';
import {
  PixelButton, PixelInput, PixelCard, PixelTabs,
  PixelSelect, PixelCheckbox, PixelTooltip, PixelBadge, useToast,
} from '@/components/pixel';
import { useUserDataStore } from '@/store/userDataStore';

const TABS = [
  { key: 'basic',  label: '기본 스텟' },
  { key: 'skill',  label: '스킬' },
  { key: 'buff',   label: '버프/환경' },
];

function StatRow({ label, value, tip }: { label: string; value: string; tip?: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '5px 0', borderBottom: 'var(--border-pixel)' }}>
      <span style={{ fontSize: 11, color: 'var(--color-ink)' }}>
        {tip ? <PixelTooltip tip={tip}><span style={{ borderBottom: '1px dotted var(--color-ink-muted)', cursor: 'help' }}>{label}</span></PixelTooltip> : label}
      </span>
      <span style={{ fontSize: 13, fontWeight: 700 }}>{value}</span>
    </div>
  );
}

function SensitivityBar({ label, delta, max }: { label: string; delta: number; max: number }) {
  const pct = max > 0 ? (delta / max) * 100 : 0;
  return (
    <div style={{ marginBottom: 6 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, marginBottom: 2 }}>
        <span style={{ color: 'var(--color-ink)' }}>{label}</span>
        <span style={{ fontWeight: 700 }}>+{delta.toFixed(2)}%</span>
      </div>
      <div style={{ background: 'var(--color-bg-base)', border: '2px solid var(--color-border)', height: 10 }}>
        <div style={{ background: 'var(--color-accent-pink)', height: '100%', width: `${pct}%`, transition: 'width 0.2s' }} />
      </div>
    </div>
  );
}

export function DamageCalculator() {
  const [tab, setTab] = useState('basic');
  const [input, setInput] = useState<DamageInput>(DEFAULT_INPUT);
  const [presetName, setPresetName] = useState('');
  const { addPreset } = useUserDataStore();
  const { toast } = useToast();

  const set = useCallback(<K extends keyof DamageInput>(key: K, value: DamageInput[K]) => {
    setInput((prev) => ({ ...prev, [key]: value }));
  }, []);

  const setNum = useCallback((key: keyof DamageInput, raw: string) => {
    const n = parseFloat(raw);
    setInput((prev) => ({ ...prev, [key]: isNaN(n) ? 0 : n }));
  }, []);

  const result = useMemo(() => calcDamage(input), [input]);
  const maxSens = result.sensitivity[0]?.delta ?? 0;

  const handleSavePreset = () => {
    if (!presetName.trim()) { toast('프리셋 이름을 입력하세요', 'error'); return; }
    addPreset({ calcId: 'damage', name: presetName.trim(), inputs: input as unknown as Record<string, unknown>, notes: '' });
    toast(`"${presetName.trim()}" 저장됨`, 'success');
    setPresetName('');
  };

  const numInput = (label: string, k: keyof DamageInput, suffix?: string, tip?: string) => (
    <PixelInput
      label={label}
      suffix={suffix}
      type="number"
      inputMode="decimal"
      value={(input[k] as number) === 0 ? '' : String(input[k])}
      onChange={(e) => setNum(k, e.target.value)}
      placeholder="0"
      hint={tip}
    />
  );

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'start' }}>
      {/* ─── 입력 패널 ── */}
      <div>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
          <PixelInput
            label="프리셋 이름"
            value={presetName}
            onChange={(e) => setPresetName(e.target.value)}
            placeholder="내 빌드"
            style={{ flex: 1, minWidth: 120 }}
          />
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <PixelButton size="sm" variant="primary" onClick={handleSavePreset}>저장</PixelButton>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <PixelButton size="sm" variant="ghost" onClick={() => setInput(DEFAULT_INPUT)}>초기화</PixelButton>
          </div>
        </div>

        <PixelTabs tabs={TABS} active={tab} onChange={setTab} />

        <div style={{ padding: '14px 0', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {tab === 'basic' && (
            <>
              <PixelInput
                label="공격력"
                placeholder="예: 247.2G 또는 1.23T 또는 55700000"
                value={input.attackRaw}
                onChange={(e) => {
                  const raw = e.target.value;
                  const parsed = parseGameNumber(raw);
                  setInput((p) => ({ ...p, attackRaw: raw, attack: isNaN(parsed) ? 0 : parsed }));
                }}
                hint="게임 스펙창 표기값 그대로 입력 (K, M, G, T 단위 포함 가능)"
              />
              {numInput('기본 공격 피해량', 'normalAttackDmg', '%', '스펙창 → 기본 공격 피해량 (100% = ×1.0)')}
              {numInput('일반 몬스터 피해량', 'normalMonsterDmg', '%', '일반 몬스터 대상 피해량')}
              {numInput('보스 몬스터 피해량', 'bossMonsterDmg', '%', '보스 대상 피해량')}
              {numInput('모든 피해량 증가', 'allDmgBonus', '%', '스펙창 → 모든 피해량 증가')}
              {numInput('현재 스텟 레벨', 'currentStatLevel', '', '월드 제한 비교용 (공격력/생명력/회복력 스텟 레벨)')}
            </>
          )}

          {tab === 'skill' && (
            <>
              {numInput('스킬 피해량', 'skillDmg', '%', '스펙창 → 스킬 피해량')}
              {numInput('스킬 계수', 'skillCoeff', '%', '스킬 설명에 표기된 피해량% (예: 냉기폭풍 2091%)')}
              {numInput('속성 추가 데미지', 'attributeCoeff', '%', '스킬 속성 조건 충족 시 추가 피해% (0이면 미적용)')}
              <PixelCheckbox
                label="속성 조건 충족 (빙결/생명 등)"
                checked={input.attributeApplied}
                onChange={(e) => set('attributeApplied', e.target.checked)}
              />
              {numInput('스킬 쿨다운', 'skillCooldown', '초', 'DPS 계산용')}
              {numInput('초당 평타 횟수', 'attacksPerSec', '회/초', 'DPS 계산용')}
            </>
          )}

          {tab === 'buff' && (
            <>
              {numInput('치명타 확률', 'critRate', '%', '버프로만 획득. 신화 +30%, 전설 +20%')}
              {numInput('치명타 피해량 증가', 'critDmgBonus', '%', '신화 +50%. 기본 치명 배수 1.5×에 추가')}
              <PixelCheckbox
                label="보스 대상"
                checked={input.isBoss}
                onChange={(e) => set('isBoss', e.target.checked)}
              />
              <PixelSelect
                label="현재 월드 단계"
                options={WORLD_STAGE_OPTIONS}
                value={String(input.worldStage)}
                onChange={(e) => set('worldStage', parseInt(e.target.value))}
              />
            </>
          )}
        </div>
      </div>

      {/* ─── 결과 패널 ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {result.isOverStatLimit && (
          <div style={{ padding: '8px 12px', background: '#fff3cd', border: 'var(--border-pixel)', fontSize: 11, fontWeight: 700 }}>
            ⚠️ 스텟 레벨 {input.currentStatLevel.toLocaleString()}이 {result.worldStatLimit?.toLocaleString()} 제한 초과
          </div>
        )}

        <PixelCard title={<>평타 데미지 <PixelBadge variant={input.isBoss ? 'danger' : 'sky'}>{input.isBoss ? '보스' : '일반'}</PixelBadge></>}>
          <StatRow label="일반 타격" value={formatGameNumber(result.normalHit)} />
          <StatRow label="치명타" value={formatGameNumber(result.normalCrit)} tip="기본 배수 1.5× + 치명피해량% (추정치)" />
          <StatRow
            label={`기대치 (치명 ${formatPct(input.critRate)})`}
            value={formatGameNumber(result.normalExpected)}
            tip="일반×(1-치명확률%) + 치명타×치명확률%"
          />
        </PixelCard>

        <PixelCard title="스킬 데미지 (1타)">
          <StatRow label="일반" value={formatGameNumber(result.skillHit)} />
          <StatRow label="치명타" value={formatGameNumber(result.skillCrit)} />
          <StatRow label="기대치" value={formatGameNumber(result.skillExpected)} />
        </PixelCard>

        <PixelCard title="DPS (초당 기대 데미지)">
          <StatRow
            label="DPS"
            value={formatGameNumber(result.dps)}
            tip="(평타기대치×평타속도) + (스킬기대치/쿨다운)"
          />
          <StatRow label="평타/초" value={`${input.attacksPerSec}회`} />
          <StatRow label="스킬 쿨다운" value={`${input.skillCooldown}초`} />
        </PixelCard>

        {result.sensitivity.length > 0 && (
          <PixelCard title="민감도 (항목 +1% 시 평타 기대치 변화)">
            {result.sensitivity.slice(0, 5).map((s) => (
              <SensitivityBar key={s.key} label={s.label} delta={s.delta} max={maxSens} />
            ))}
          </PixelCard>
        )}

        <div style={{ fontSize: 10, color: 'var(--color-ink-muted)', lineHeight: 1.6 }}>
          ※ 수치는 커뮤니티 역산 추정치 (±5% 오차 가능) · 치명타 배수 1.5× 미확인<br />
          ※ 출처: 네이버 라운지 데미지편 (YUI, 2026-03-08)
        </div>
      </div>
    </div>
  );
}
