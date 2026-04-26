import { useState } from 'react';
import { fieldsByGroup, GROUP_LABELS, type StatGroup, type StatFieldDef, type StatsFlat } from '@/data/statsSchema';
import { PixelCard, PixelInput, PixelBadge } from '@/components/pixel';
import { parseGameNumber } from '@/lib/format/number';

interface StatsFormProps {
  stats: StatsFlat;
  setStat: (key: string, value: number) => void;
  rawValues?: Record<string, string>;
  setRaw?: (key: string, raw: string) => void;
  groups?: StatGroup[];
  compact?: boolean;
}

const GROUP_ORDER: StatGroup[] = ['girl', 'drone', 'companion', 'effect'];

function FieldInput({
  field, value, raw, onChange, onRawChange,
}: {
  field: StatFieldDef;
  value: number;
  raw?: string;
  onChange: (v: number) => void;
  onRawChange?: (s: string) => void;
}) {
  // 모든 필드는 K/M/G/T 단위 입력 가능 (parseGameNumber 사용)
  // raw는 사용자가 친 그대로 보존, onChange로 숫자 값 전달
  const placeholder = field.isLargeNumber ? '예: 247.2G' : (field.defaultValue === 100 ? '100' : '0');
  const display = raw !== undefined ? raw : (value === 0 || value === field.defaultValue ? '' : String(value));
  return (
    <PixelInput
      label={field.label}
      placeholder={placeholder}
      value={display}
      onChange={(e) => {
        const r = e.target.value;
        onRawChange?.(r);
        const n = parseGameNumber(r);
        onChange(isNaN(n) ? 0 : n);
      }}
      hint={field.hint}
      suffix={field.suffix}
      inputMode="decimal"
    />
  );
}

export function StatsForm({ stats, setStat, rawValues, setRaw, groups = GROUP_ORDER, compact = false }: StatsFormProps) {
  const [collapsed, setCollapsed] = useState<Record<StatGroup, boolean>>({
    girl: false, drone: false, companion: false, effect: false,
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {groups.map((g) => {
        const fields = fieldsByGroup(g);
        const isCollapsed = collapsed[g];
        return (
          <PixelCard
            key={g}
            title={
              <div
                onClick={() => setCollapsed((c) => ({ ...c, [g]: !c[g] }))}
                style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, userSelect: 'none' }}
              >
                <span>{isCollapsed ? '▶' : '▼'}</span>
                <span>{GROUP_LABELS[g]}</span>
                <PixelBadge variant="sky">{fields.length}개</PixelBadge>
              </div>
            }
          >
            {!isCollapsed && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: compact ? '1fr' : 'repeat(auto-fill, minmax(180px, 1fr))',
                gap: 8,
              }}>
                {fields.map((f) => (
                  <FieldInput
                    key={f.key}
                    field={f}
                    value={stats[f.key] ?? 0}
                    raw={rawValues?.[f.key]}
                    onChange={(v) => setStat(f.key, v)}
                    onRawChange={(s) => setRaw?.(f.key, s)}
                  />
                ))}
              </div>
            )}
          </PixelCard>
        );
      })}
    </div>
  );
}
