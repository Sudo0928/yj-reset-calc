import { useState } from 'react';
import {
  PixelButton,
  PixelInput,
  PixelCard,
  PixelModal,
  PixelTabs,
  PixelSelect,
  PixelCheckbox,
  PixelTooltip,
  PixelBadge,
  useToast,
} from '@/components/pixel';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="devgallery__section">
      <div className="devgallery__section-title">{title}</div>
      <div className="devgallery__row">{children}</div>
    </div>
  );
}

export function DevGallery() {
  const [tab, setTab] = useState('buttons');
  const [modalOpen, setModalOpen] = useState(false);
  const [checked, setChecked] = useState(false);
  const { toast } = useToast();

  return (
    <div className="devgallery">
      <h1 style={{ fontSize: 18, fontWeight: 700, marginBottom: 24 }}>
        컴포넌트 갤러리{' '}
        <PixelBadge variant="tbd">dev only</PixelBadge>
      </h1>

      <Section title="PixelButton">
        <PixelButton>기본</PixelButton>
        <PixelButton variant="primary">주요</PixelButton>
        <PixelButton variant="sky">하늘</PixelButton>
        <PixelButton variant="yellow">골드</PixelButton>
        <PixelButton variant="danger">위험</PixelButton>
        <PixelButton variant="ghost">고스트</PixelButton>
        <PixelButton size="sm">작은</PixelButton>
        <PixelButton size="lg">큰</PixelButton>
        <PixelButton disabled>비활성</PixelButton>
        <PixelButton onClick={() => toast('토스트 테스트!', 'success')}>
          토스트 열기
        </PixelButton>
      </Section>

      <Section title="PixelBadge">
        <PixelBadge>기본</PixelBadge>
        <PixelBadge variant="pink">핑크</PixelBadge>
        <PixelBadge variant="sky">하늘</PixelBadge>
        <PixelBadge variant="yellow">노랑</PixelBadge>
        <PixelBadge variant="mint">민트</PixelBadge>
        <PixelBadge variant="gold">골드</PixelBadge>
        <PixelBadge variant="danger">위험</PixelBadge>
        <PixelBadge variant="tbd">TBD</PixelBadge>
      </Section>

      <Section title="PixelInput">
        <div style={{ width: 200 }}>
          <PixelInput label="공격력" placeholder="0" suffix="점" type="number" inputMode="decimal" />
        </div>
        <div style={{ width: 200 }}>
          <PixelInput label="스테이지" placeholder="1-1" hint="현재 진행 중인 스테이지" />
        </div>
      </Section>

      <Section title="PixelSelect">
        <div style={{ width: 160 }}>
          <PixelSelect
            label="월드 단계"
            options={[
              { value: '1', label: '1단계 (시작)' },
              { value: '2', label: '2단계 (도전)' },
              { value: '14', label: '14단계 (절망)' },
            ]}
          />
        </div>
      </Section>

      <Section title="PixelCheckbox">
        <PixelCheckbox
          label="치명타 적용"
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        <PixelCheckbox label="올버프 활성" defaultChecked />
        <PixelCheckbox label="비활성" disabled />
      </Section>

      <Section title="PixelTabs">
        <div style={{ width: '100%' }}>
          <PixelTabs
            tabs={[
              { key: 'buttons', label: '버튼' },
              { key: 'inputs', label: '입력' },
              { key: 'slots', label: '슬롯' },
            ]}
            active={tab}
            onChange={setTab}
          />
          <div style={{ padding: '12px 0', fontSize: 12 }}>선택된 탭: {tab}</div>
        </div>
      </Section>

      <Section title="PixelTooltip">
        <PixelTooltip tip="치명타 확률은 0~100% 범위입니다">
          <PixelBadge variant="sky">툴팁 hover</PixelBadge>
        </PixelTooltip>
      </Section>

      <Section title="PixelCard">
        <PixelCard
          title="데미지 계산 결과"
          footer={
            <>
              <PixelButton size="sm" variant="ghost">초기화</PixelButton>
              <PixelButton size="sm" variant="primary">프리셋 저장</PixelButton>
            </>
          }
          className=""
        >
          <p style={{ margin: 0, fontSize: 12 }}>카드 본문 영역입니다.</p>
        </PixelCard>
      </Section>

      <Section title="PixelModal">
        <PixelButton variant="primary" onClick={() => setModalOpen(true)}>
          모달 열기
        </PixelButton>
        <PixelModal
          isOpen={modalOpen}
          title="프리셋 저장"
          onClose={() => setModalOpen(false)}
          footer={
            <>
              <PixelButton size="sm" variant="ghost" onClick={() => setModalOpen(false)}>
                취소
              </PixelButton>
              <PixelButton size="sm" variant="primary" onClick={() => setModalOpen(false)}>
                저장
              </PixelButton>
            </>
          }
        >
          <PixelInput label="프리셋 이름" placeholder="내 빌드" />
        </PixelModal>
      </Section>

    </div>
  );
}
