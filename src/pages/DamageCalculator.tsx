import { useState } from 'react';
import { useDamageStore } from '@/store/damageStore';
import { useUserDataStore } from '@/store/userDataStore';
import { useToast } from '@/components/pixel';
import { calculateDamage, calculateSensitivity } from '@/lib/formulas/damage';
import { WORLD_STAGES, SKILL_TEMPLATES } from '@/data/damage';
import {
  PixelButton,
  PixelCard,
  PixelInput,
  PixelSelect,
  PixelCheckbox,
  PixelTabs,
  PixelBadge,
} from '@/components/pixel';

export function DamageCalculator() {
  const { input, setInput, reset } = useDamageStore();
  const { addPreset } = useUserDataStore();
  const { toast } = useToast();
  const [tab, setTab] = useState('input');
  const [presetName, setPresetName] = useState('');

  const output = calculateDamage(input);
  const sensitivity = calculateSensitivity(input, output);

  const handlePresetSave = () => {
    if (!presetName.trim()) {
      toast('프리셋 이름을 입력하세요', 'error');
      return;
    }
    addPreset({
      name: presetName.trim(),
      calcId: 'damage',
      inputs: JSON.parse(JSON.stringify(input)),
      notes: '',
    });
    toast(`프리셋 저장됨: ${presetName}`, 'success');
    setPresetName('');
  };

  return (
    <div style={{ paddingTop: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>데미지 / 스탯 계산기</h1>
        <PixelBadge variant="pink">모드 A: 직접 수치 입력</PixelBadge>
      </div>

      <PixelTabs
        tabs={[
          { key: 'input', label: '입력' },
          { key: 'result', label: '결과' },
          { key: 'sensitivity', label: '민감도' },
        ]}
        active={tab}
        onChange={setTab}
      />

      {tab === 'input' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 16 }}>
          {/* 기본 스탯 */}
          <PixelCard title="기본 스탯">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
              <PixelInput
                label="공격력"
                type="number"
                value={input.atk}
                onChange={(e) => setInput({ atk: parseFloat(e.target.value) || 0 })}
              />
              <PixelInput
                label="치명타 확률 (%)"
                type="number"
                value={input.critRate * 100}
                onChange={(e) => setInput({ critRate: (parseFloat(e.target.value) || 0) / 100 })}
              />
              <PixelInput
                label="치명타 데미지 (배수)"
                type="number"
                step="0.1"
                value={input.critDmg}
                onChange={(e) => setInput({ critDmg: parseFloat(e.target.value) || 1 })}
              />
              <PixelInput
                label="스킬 데미지 (%)"
                type="number"
                value={input.skillDmgMul * 100}
                onChange={(e) => setInput({ skillDmgMul: (parseFloat(e.target.value) || 0) / 100 })}
              />
              <PixelInput
                label="추가 데미지 (%)"
                type="number"
                value={input.additionalDmgMul * 100}
                onChange={(e) => setInput({ additionalDmgMul: (parseFloat(e.target.value) || 0) / 100 })}
              />
              <PixelInput
                label="관통"
                type="number"
                value={input.penetration}
                onChange={(e) => setInput({ penetration: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </PixelCard>

          {/* 스킬 */}
          <PixelCard title="스킬">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
              <PixelSelect
                label="스킬 선택"
                options={SKILL_TEMPLATES.map((s) => ({ value: s.id, label: s.name }))}
              />
              <PixelInput
                label="스킬 계수"
                type="number"
                step="0.1"
                value={input.skillCoeff}
                onChange={(e) => setInput({ skillCoeff: parseFloat(e.target.value) || 1 })}
              />
              <PixelInput
                label="쿨다운 (초)"
                type="number"
                step="0.1"
                value={input.skillCooldown}
                onChange={(e) => setInput({ skillCooldown: parseFloat(e.target.value) || 1 })}
              />
            </div>
          </PixelCard>

          {/* 장비/코스튬/동료 */}
          <PixelCard title="장비·코스튬·동료">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
              <PixelInput
                label="장비 공격력 보너스"
                type="number"
                value={input.equipAtkBonus}
                onChange={(e) => setInput({ equipAtkBonus: parseFloat(e.target.value) || 0 })}
              />
              <PixelInput
                label="장비 치명타 보너스 (%)"
                type="number"
                value={input.equipCritBonus}
                onChange={(e) => setInput({ equipCritBonus: parseFloat(e.target.value) || 0 })}
              />
              <PixelInput
                label="코스튬 공격력 보너스"
                type="number"
                value={input.costumeAtkBonus}
                onChange={(e) => setInput({ costumeAtkBonus: parseFloat(e.target.value) || 0 })}
              />
              <PixelInput
                label="동료 공격력 보너스"
                type="number"
                value={input.companionAtkBonus}
                onChange={(e) => setInput({ companionAtkBonus: parseFloat(e.target.value) || 0 })}
              />
              <PixelInput
                label="동료 치명타 데미지 보너스"
                type="number"
                step="0.1"
                value={input.companionCritDmgBonus}
                onChange={(e) => setInput({ companionCritDmgBonus: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </PixelCard>

          {/* 카드·버프 */}
          <PixelCard title="카드 효과 & 버프">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
              <PixelInput
                label="카드 데미지 보너스 (%)"
                type="number"
                value={input.cardDmgBonus}
                onChange={(e) => setInput({ cardDmgBonus: parseFloat(e.target.value) || 0 })}
              />
              <PixelInput
                label="카드 공격력 보너스"
                type="number"
                value={input.cardAtkBonus}
                onChange={(e) => setInput({ cardAtkBonus: parseFloat(e.target.value) || 0 })}
              />
              <PixelInput
                label="카드 치명타 보너스 (%)"
                type="number"
                value={input.cardCritBonus}
                onChange={(e) => setInput({ cardCritBonus: parseFloat(e.target.value) || 0 })}
              />
              <PixelSelect
                label="올버프 단계"
                options={[
                  { value: '0', label: '없음' },
                  { value: '1', label: '1단계' },
                  { value: '2', label: '2단계' },
                  { value: '3', label: '3단계' },
                  { value: '4', label: '4단계' },
                  { value: '5', label: '5단계' },
                ]}
                value={String(input.allBuffStage)}
                onChange={(e) => setInput({ allBuffStage: parseInt(e.target.value, 10) })}
              />
              <PixelInput
                label="임시 버프 배수"
                type="number"
                step="0.1"
                value={input.temporaryBuffMul}
                onChange={(e) => setInput({ temporaryBuffMul: parseFloat(e.target.value) || 1 })}
              />
            </div>
          </PixelCard>

          {/* 적·환경 */}
          <PixelCard title="적·환경">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
              <PixelSelect
                label="월드 단계"
                options={Object.entries(WORLD_STAGES).map(([k, v]) => ({ value: k, label: v.name }))}
              />
              <PixelInput
                label="적 방어력"
                type="number"
                value={input.enemyDefense}
                onChange={(e) => setInput({ enemyDefense: parseFloat(e.target.value) || 0 })}
              />
              <PixelInput
                label="월드 피격 감소 (%)"
                type="number"
                value={input.stageDamageReduction * 100}
                onChange={(e) => setInput({ stageDamageReduction: (parseFloat(e.target.value) || 0) / 100 })}
              />
              <div style={{ gridColumn: '1 / -1' }}>
                <PixelCheckbox
                  label="절망 보스 (14단계)"
                  checked={input.isBoss}
                  onChange={(e) => setInput({ isBoss: e.target.checked })}
                />
              </div>
            </div>
          </PixelCard>

          {/* 프리셋 */}
          <PixelCard
            title="프리셋 저장"
            footer={
              <PixelButton size="sm" variant="primary" onClick={handlePresetSave}>
                저장
              </PixelButton>
            }
          >
            <PixelInput
              label="프리셋 이름"
              value={presetName}
              onChange={(e) => setPresetName(e.target.value)}
              placeholder="내 빌드"
            />
          </PixelCard>

          <PixelButton full variant="ghost" onClick={reset}>
            초기화
          </PixelButton>
        </div>
      )}

      {tab === 'result' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, paddingTop: 16 }}>
          <PixelCard title="1타 데미지">
            <div style={{ display: 'grid', gap: 8, fontSize: 12 }}>
              <div>평균: <strong style={{ color: 'var(--color-accent-pink)' }}>{output.avgDamage.toLocaleString()}</strong></div>
              <div>치명: <strong>{output.maxDamage.toLocaleString()}</strong></div>
              <div>비치명: <strong>{output.minDamage.toLocaleString()}</strong></div>
            </div>
          </PixelCard>

          <PixelCard title="DPS">
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-accent-sky)' }}>
              {output.dps.toLocaleString()}
              <span style={{ fontSize: 11, color: 'var(--color-ink-muted)', marginLeft: 4 }}>/ 초</span>
            </div>
          </PixelCard>

          <PixelCard title="14단계 절망 보스 처치 시간">
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-danger)' }}>
              {output.boss14ClearTime.toLocaleString()}
              <span style={{ fontSize: 11, color: 'var(--color-ink-muted)', marginLeft: 4 }}>초</span>
            </div>
          </PixelCard>
        </div>
      )}

      {tab === 'sensitivity' && (
        <div style={{ paddingTop: 16 }}>
        <PixelCard title="민감도 분석">
          <p style={{ fontSize: 11, color: 'var(--color-ink-muted)', margin: '0 0 12px' }}>
            각 입력을 10% 올렸을 때 DPS 변화율:
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {Object.entries(sensitivity)
              .sort(([, a], [, b]) => Math.abs(b) - Math.abs(a))
              .slice(0, 8)
              .map(([key, value]) => (
                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ minWidth: 80, fontSize: 11, fontWeight: 700 }}>{key}</span>
                  <div
                    style={{
                      flex: 1,
                      height: 16,
                      background: value > 0 ? 'var(--color-accent-pink)' : 'var(--color-accent-sky)',
                      width: `${Math.min(100, Math.abs(value) * 2)}%`,
                    }}
                  />
                  <span style={{ fontSize: 11, color: value > 0 ? 'var(--color-danger)' : 'var(--color-ink-muted)', minWidth: 40, textAlign: 'right' }}>
                    {value > 0 ? '+' : ''}{value}%
                  </span>
                </div>
              ))}
          </div>
        </PixelCard>
        </div>
      )}
    </div>
  );
}
