import { useRef, useState } from 'react';
import { useUserDataStore } from '@/store/userDataStore';
import { useAuthStore } from '@/store/authStore';
import { exportToJson, importFromJsonFile } from '@/lib/storage/jsonExport';
import { useToast } from '@/components/pixel';
import {
  PixelButton,
  PixelCard,
  PixelModal,
  PixelInput,
  PixelSelect,
  PixelBadge,
} from '@/components/pixel';
import { PresetManager } from '@/components/PresetManager';
import type { CustomDataItem } from '@/lib/storage/schema';

const TYPE_OPTIONS = [
  { value: 'companion', label: '동료 특성' },
  { value: 'equipment', label: '장비 옵션' },
  { value: 'costume', label: '코스튬 옵션' },
  { value: 'skill', label: '스킬 계수' },
  { value: 'card', label: '카드 효과' },
];

const TYPE_BADGE: Record<CustomDataItem['type'], 'pink' | 'sky' | 'yellow' | 'mint' | 'gold'> = {
  companion: 'pink',
  equipment: 'sky',
  costume: 'yellow',
  skill: 'mint',
  card: 'gold',
};

function AddItemModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const addCustomItem = useUserDataStore((s) => s.addCustomItem);
  const { toast } = useToast();
  const [type, setType] = useState<CustomDataItem['type']>('companion');
  const [label, setLabel] = useState('');
  const [value, setValue] = useState('');
  const [key, setKey] = useState('');

  const reset = () => { setLabel(''); setKey(''); setValue(''); };

  const handleSubmit = () => {
    if (!label.trim() || !key.trim()) {
      toast('이름과 속성 키를 입력하세요', 'error');
      return;
    }
    const numVal = parseFloat(value);
    addCustomItem({
      type,
      label: label.trim(),
      data: { [key.trim()]: isNaN(numVal) ? value : numVal },
    });
    toast('데이터 추가됨', 'success');
    reset();
    onClose();
  };

  return (
    <PixelModal
      isOpen={isOpen}
      title="커스텀 데이터 추가"
      onClose={onClose}
      footer={
        <>
          <PixelButton size="sm" variant="ghost" onClick={onClose}>취소</PixelButton>
          <PixelButton size="sm" variant="primary" onClick={handleSubmit}>추가</PixelButton>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <PixelSelect
          label="종류"
          options={TYPE_OPTIONS}
          value={type}
          onChange={(e) => setType(e.target.value as CustomDataItem['type'])}
        />
        <PixelInput
          label="이름 (예: 슬라임 동료 A)"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="동료/스킬/카드 이름"
        />
        <PixelInput
          label="속성 키 (예: attackBonus)"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="attackBonus"
        />
        <PixelInput
          label="속성 값 (숫자 또는 텍스트)"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="12.5"
          hint="숫자는 자동으로 number 타입으로 저장됩니다"
        />
      </div>
    </PixelModal>
  );
}

export function MyData() {
  const { user, firebaseEnabled } = useAuthStore();
  const { customData, presets, removeCustomItem, exportData, mergeImport } =
    useUserDataStore();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [addOpen, setAddOpen] = useState(false);

  const handleExport = () => {
    exportToJson(exportData());
    toast('JSON 파일 다운로드 시작', 'success');
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const imported = await importFromJsonFile(file);
      mergeImport(imported.data, 'merge');
      toast(`가져오기 완료 — 커스텀 ${imported.data.customData.length}개, 프리셋 ${imported.data.presets.length}개`, 'success');
    } catch (err) {
      toast(err instanceof Error ? err.message : '가져오기 실패', 'error');
    }
    e.target.value = '';
  };

  return (
    <div style={{ paddingTop: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>내 데이터</h1>
        {!firebaseEnabled && (
          <PixelBadge variant="tbd">Firebase 미설정 — 로컬 저장</PixelBadge>
        )}
        {user && <PixelBadge variant="mint">동기화 중: {user.displayName}</PixelBadge>}
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        <PixelButton variant="primary" onClick={() => setAddOpen(true)}>
          + 커스텀 데이터 추가
        </PixelButton>
        <PixelButton variant="sky" onClick={handleExport}>
          JSON 내보내기
        </PixelButton>
        <PixelButton
          variant="ghost"
          onClick={() => fileInputRef.current?.click()}
        >
          JSON 가져오기
        </PixelButton>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          style={{ display: 'none' }}
          onChange={handleImport}
        />
      </div>

      {customData.length > 0 && (
      <PixelCard title={`커스텀 데이터 (${customData.length}개) — 레거시 (Phase 8 폐기)`}>
        {customData.length === 0 ? (
          <p style={{ fontSize: 12, color: 'var(--color-ink-muted)', margin: 0 }}>
            아직 등록된 데이터가 없습니다.
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {customData.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '6px 0',
                  borderBottom: 'var(--border-pixel)',
                }}
              >
                <PixelBadge variant={TYPE_BADGE[item.type]}>
                  {TYPE_OPTIONS.find((o) => o.value === item.type)?.label}
                </PixelBadge>
                <span style={{ flex: 1, fontSize: 12, fontWeight: 700 }}>{item.label}</span>
                <span style={{ fontSize: 11, color: 'var(--color-ink-muted)' }}>
                  {Object.entries(item.data)
                    .map(([k, v]) => `${k}: ${v}`)
                    .join(', ')}
                </span>
                <PixelButton
                  size="sm"
                  variant="danger"
                  onClick={() => {
                    removeCustomItem(item.id);
                    toast('삭제됨', 'success');
                  }}
                >
                  삭제
                </PixelButton>
              </div>
            ))}
          </div>
        )}
      </PixelCard>
      )}

      <div style={{ marginTop: 20 }}>
        <PixelCard title={`저장된 프리셋 (${presets.length}개)`}>
          <PresetManager
            emptyMessage='저장된 프리셋이 없습니다. 계산기에서 "프리셋 저장"을 클릭하면 여기에 표시됩니다.'
          />
        </PixelCard>
      </div>

      <AddItemModal isOpen={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
}
