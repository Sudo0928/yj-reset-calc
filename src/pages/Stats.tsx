import { useState, useMemo } from 'react';
import { useStatsStore } from '@/store/statsStore';
import { StatsForm } from '@/components/stats/StatsForm';
import { PixelButton, PixelInput, PixelCheckbox, PixelSelect, PixelCard, PixelBadge, useToast } from '@/components/pixel';
import { WORLD_STAGE_OPTIONS } from '@/data/worldLimits';
import { useUserDataStore } from '@/store/userDataStore';
import { ASSUMPTION_FIELDS, hasCustomAssumptions } from '@/data/statsSchema';

export function Stats() {
  const { stats, env, assumptions, setStat, setEnv, setAssumption, resetAssumptions, reset, loadStats, loadEnv } = useStatsStore();
  const { addPreset } = useUserDataStore();
  const { toast } = useToast();
  const [rawValues, setRawValues] = useState<Record<string, string>>({});
  const [presetName, setPresetName] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const isCustomAssumption = hasCustomAssumptions(assumptions);

  const setRaw = (key: string, raw: string) => setRawValues((r) => ({ ...r, [key]: raw }));

  const handleSavePreset = () => {
    if (!presetName.trim()) { toast('프리셋 이름을 입력하세요', 'error'); return; }
    addPreset({
      calcId: 'stats',
      name: presetName.trim(),
      inputs: { stats, env } as unknown as Record<string, unknown>,
      notes: '',
    });
    toast(`"${presetName.trim()}" 저장됨`, 'success');
    setPresetName('');
  };

  const handleLoadPreset = (presetId: string) => {
    const preset = useUserDataStore.getState().presets.find((p) => p.id === presetId);
    if (!preset || preset.calcId !== 'stats') return;
    const data = preset.inputs as { stats?: Record<string, number>; env?: Record<string, unknown> };
    if (data.stats) loadStats(data.stats);
    if (data.env) loadEnv(data.env as Parameters<typeof loadEnv>[0]);
    setRawValues({});
    toast(`"${preset.name}" 불러옴`, 'success');
  };

  const allPresets = useUserDataStore((s) => s.presets);
  const statsPresets = useMemo(() => allPresets.filter((p) => p.calcId === 'stats'), [allPresets]);

  return (
    <div style={{ paddingTop: 24 }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 6 }}>
          <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>내 빌드 (33필드)</h1>
          <PixelBadge variant="pink">Phase 8</PixelBadge>
        </div>
        <p style={{ fontSize: 12, color: 'var(--color-ink-muted)', margin: 0, lineHeight: 1.7 }}>
          인게임 스펙창의 모든 수치(여고생 14 + 드론 5 + 동료 8 + 효과 6 = 33개)를 한 번 입력하면
          <br /><strong>시간당 자원 / 자원 의사결정 / 빌드 비교 / DPS 분해</strong> 모든 페이지에서 자동 사용됩니다.
        </p>
      </div>

      {/* 프리셋 + 초기화 */}
      <PixelCard title="빌드 프리셋">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'flex-end' }}>
          <PixelInput
            label="새 프리셋 이름"
            value={presetName}
            onChange={(e) => setPresetName(e.target.value)}
            placeholder="예: 14층 풀버프"
            style={{ flex: 1, minWidth: 160 }}
          />
          <PixelButton size="sm" variant="primary" onClick={handleSavePreset}>현재 빌드 저장</PixelButton>
          {statsPresets.length > 0 && (
            <PixelSelect
              label="기존 프리셋 불러오기"
              options={[{ value: '', label: '— 선택 —' }, ...statsPresets.map((p) => ({ value: p.id, label: p.name }))]}
              value=""
              onChange={(e) => e.target.value && handleLoadPreset(e.target.value)}
              style={{ minWidth: 160 }}
            />
          )}
          <PixelButton size="sm" variant="ghost" onClick={() => { reset(); setRawValues({}); }}>초기화</PixelButton>
        </div>
      </PixelCard>

      <div style={{ height: 16 }} />

      {/* 환경 */}
      <PixelCard title="전투 환경">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 8 }}>
          <PixelSelect
            label="현재 월드 단계"
            options={WORLD_STAGE_OPTIONS}
            value={String(env.worldStage)}
            onChange={(e) => setEnv('worldStage', parseInt(e.target.value))}
          />
          <PixelInput
            label="분당 몬스터 처치수"
            type="number"
            value={env.killsPerMin === 0 ? '' : String(env.killsPerMin)}
            onChange={(e) => setEnv('killsPerMin', parseFloat(e.target.value) || 0)}
            suffix="회/분"
            hint="DPS×처치수 모드용"
          />
          <PixelInput
            label="분당 측정 골드"
            type="number"
            value={env.measuredGoldPerMin === 0 ? '' : String(env.measuredGoldPerMin)}
            onChange={(e) => setEnv('measuredGoldPerMin', parseFloat(e.target.value) || 0)}
            suffix="골드/분"
            hint="절전모드 화면 측정값"
          />
          <PixelInput
            label="몹 1마리당 골드"
            type="number"
            value={env.goldPerKill === 0 ? '' : String(env.goldPerKill)}
            onChange={(e) => setEnv('goldPerKill', parseFloat(e.target.value) || 0)}
            suffix="골드"
            hint="DPS×처치수 모드 보조"
          />
          <PixelInput
            label="슬라임 평균 레벨"
            type="number"
            value={String(env.slimeAvgLevel)}
            onChange={(e) => setEnv('slimeAvgLevel', parseFloat(e.target.value) || 0)}
            hint="합성 시 평균 슬라임 레벨 (n²개 파편)"
          />
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 10 }}>
          <PixelCheckbox label="보스 대상" checked={env.isBoss} onChange={(e) => setEnv('isBoss', e.target.checked)} />
          <PixelCheckbox label="슬라임 마스터 팩 (×2)" checked={env.slimeMasterPack} onChange={(e) => setEnv('slimeMasterPack', e.target.checked)} />
          <PixelCheckbox label="연구소 빛파편+30%" checked={env.hasResearchBonus} onChange={(e) => setEnv('hasResearchBonus', e.target.checked)} />
        </div>
      </PixelCard>

      <div style={{ height: 16 }} />

      <StatsForm stats={stats} setStat={setStat} rawValues={rawValues} setRaw={setRaw} />

      {/* ─── 고급 가정 (추정치 보정) ─── */}
      <div style={{ marginTop: 16 }} />
      <PixelCard
        title={
          <div
            onClick={() => setShowAdvanced((v) => !v)}
            style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}
          >
            <span>{showAdvanced ? '▼' : '▶'}</span>
            <span>고급 가정 (추정치 보정)</span>
            {isCustomAssumption ? (
              <PixelBadge variant="pink">사용자 보정</PixelBadge>
            ) : (
              <PixelBadge variant="tbd">기본 추정치</PixelBadge>
            )}
          </div>
        }
      >
        {showAdvanced && (
          <>
            <p style={{ fontSize: 11, color: 'var(--color-ink-muted)', lineHeight: 1.6, marginTop: 0 }}>
              치명타 기본 배수·DPS 비중·슬라임 합성 빈도 같은 미공개 수치를 본인 측정값으로 보정.
              모든 계산기(/hourly, /decisions, /compare, /dps)에 즉시 반영됩니다.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 8 }}>
              {ASSUMPTION_FIELDS.map((f) => (
                <PixelInput
                  key={f.key}
                  label={f.label}
                  type="number"
                  value={String(assumptions[f.key])}
                  onChange={(e) => {
                    const n = parseFloat(e.target.value);
                    if (!isNaN(n)) setAssumption(f.key, n);
                  }}
                  hint={f.hint}
                  step={f.step}
                  min={f.min}
                  max={f.max}
                />
              ))}
            </div>
            <div style={{ marginTop: 10 }}>
              <PixelButton size="sm" variant="ghost" onClick={resetAssumptions}>가정 초기화</PixelButton>
            </div>
          </>
        )}
      </PixelCard>

      <div style={{ marginTop: 24, fontSize: 10, color: 'var(--color-ink-muted)', lineHeight: 1.7 }}>
        ※ 카드 효과(24종)·동료 특성·코스튬 옵션은 게임이 이미 합산값에 반영하므로 별도 입력 불필요.<br />
        ※ 모든 입력은 자동으로 LocalStorage에 저장됩니다 (yjreset:stats).<br />
        ※ "고급 가정" 펼침 → 치명타 기본 배수·DPS 평타·스킬 비중 등 추정치를 직접 보정할 수 있습니다.
      </div>
    </div>
  );
}
