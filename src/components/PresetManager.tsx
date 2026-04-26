import { useState, useMemo } from 'react';
import { useUserDataStore } from '@/store/userDataStore';
import { PixelButton, PixelInput, PixelBadge, useToast } from '@/components/pixel';
import type { Preset } from '@/lib/storage/schema';

interface PresetManagerProps {
  /** 특정 calcId만 필터링 (지정 없으면 전체) */
  calcIdFilter?: string;
  /** 불러오기 콜백 (지정되면 "불러오기" 버튼 노출) */
  onLoad?: (preset: Preset) => void;
  /** 빈 상태 안내 메시지 */
  emptyMessage?: string;
}

export function PresetManager({ calcIdFilter, onLoad, emptyMessage }: PresetManagerProps) {
  const allPresets = useUserDataStore((s) => s.presets);
  const updatePreset = useUserDataStore((s) => s.updatePreset);
  const removePreset = useUserDataStore((s) => s.removePreset);
  const { toast } = useToast();

  const presets = useMemo(
    () => calcIdFilter ? allPresets.filter((p) => p.calcId === calcIdFilter) : allPresets,
    [allPresets, calcIdFilter],
  );

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  const startEdit = (p: Preset) => {
    setEditingId(p.id);
    setEditingName(p.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  const saveEdit = () => {
    if (!editingId) return;
    const trimmed = editingName.trim();
    if (!trimmed) { toast('이름을 입력하세요', 'error'); return; }
    if (trimmed.length > 50) { toast('이름은 50자 이내', 'error'); return; }
    updatePreset(editingId, { name: trimmed });
    toast('프리셋 이름 변경', 'success');
    cancelEdit();
  };

  const handleDelete = (p: Preset) => {
    if (!confirm(`"${p.name}" 프리셋을 삭제하시겠습니까?`)) return;
    removePreset(p.id);
    toast('프리셋 삭제됨', 'success');
  };

  if (presets.length === 0) {
    return (
      <p style={{ fontSize: 12, color: 'var(--color-ink-muted)', margin: 0 }}>
        {emptyMessage ?? '저장된 프리셋이 없습니다.'}
      </p>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {presets.map((p) => (
        <div
          key={p.id}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '6px 8px', borderBottom: 'var(--border-pixel)',
            flexWrap: 'wrap',
          }}
        >
          <PixelBadge variant="sky">{p.calcId}</PixelBadge>
          {editingId === p.id ? (
            <>
              <PixelInput
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') saveEdit();
                  if (e.key === 'Escape') cancelEdit();
                }}
                style={{ flex: 1, minWidth: 140 }}
                autoFocus
              />
              <PixelButton size="sm" variant="primary" onClick={saveEdit}>확인</PixelButton>
              <PixelButton size="sm" variant="ghost" onClick={cancelEdit}>취소</PixelButton>
            </>
          ) : (
            <>
              <span style={{ flex: 1, fontSize: 12, fontWeight: 700, minWidth: 100 }}>{p.name}</span>
              <span style={{ fontSize: 10, color: 'var(--color-ink-muted)' }}>
                {new Date(p.createdAt).toLocaleDateString('ko-KR')}
              </span>
              {onLoad && (
                <PixelButton size="sm" variant="primary" onClick={() => onLoad(p)}>불러오기</PixelButton>
              )}
              <PixelButton size="sm" variant="ghost" onClick={() => startEdit(p)}>이름 수정</PixelButton>
              <PixelButton size="sm" variant="danger" onClick={() => handleDelete(p)}>삭제</PixelButton>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
