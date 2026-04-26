import { Link } from 'react-router-dom';
import { PixelCard, PixelBadge } from '@/components/pixel';

interface PhaseCard {
  group: 'core' | 'calc' | 'meta';
  title: string;
  description: string;
  to: string;
  badge: string;
  badgeVariant: 'pink' | 'sky' | 'yellow' | 'mint' | 'gold';
}

const CORE_CARDS: PhaseCard[] = [
  {
    group: 'core',
    title: '내 빌드 (33필드)',
    description: '인게임 스펙창 모든 수치를 한 번 입력하면 모든 계산기에서 자동 사용',
    to: '/stats',
    badge: '시작점',
    badgeVariant: 'pink',
  },
];

const CALC_CARDS: PhaseCard[] = [
  {
    group: 'calc',
    title: '시간당 자원 시뮬',
    description: '시간/일/주 골드·빛파편·연구·방치보상 누적 (측정값 / DPS×처치수 모드)',
    to: '/hourly',
    badge: 'Phase 8',
    badgeVariant: 'sky',
  },
  {
    group: 'calc',
    title: '자원 의사결정',
    description: '다이아 N개 ROI · 신화 버프 BEP · 재등반 비교 · VIP팩/룬/코스튬 환산',
    to: '/decisions',
    badge: 'Phase 9',
    badgeVariant: 'sky',
  },
  {
    group: 'calc',
    title: '빌드 비교 (Before vs After)',
    description: '두 빌드의 DPS·시간당골드·생존력 차이 + 민감도 top 5 + URL 공유',
    to: '/compare',
    badge: 'Phase 10',
    badgeVariant: 'sky',
  },
  {
    group: 'calc',
    title: '종합 DPS 분해',
    description: '여고생 / 드론 / 동료 비중 분석 + 인게임 합산 DPS ±10% 검증',
    to: '/dps',
    badge: 'Phase 11',
    badgeVariant: 'sky',
  },
  {
    group: 'calc',
    title: '데미지 계산기',
    description: '평타·스킬 1타·DPS + 14단계 절망 보스 처치 시간',
    to: '/damage',
    badge: 'Phase 3',
    badgeVariant: 'mint',
  },
  {
    group: 'calc',
    title: '골드/빛의파편 효율',
    description: '골획%·전골획% 변경 시 효율 비교 + 슬라임 합성 ROI',
    to: '/gold',
    badge: 'Phase 4',
    badgeVariant: 'mint',
  },
  {
    group: 'calc',
    title: '상자 EV',
    description: '즉시 개봉 가성비 + N회 개봉 베르누이 분포 + 몬테카를로 시뮬',
    to: '/chest',
    badge: 'Phase 5',
    badgeVariant: 'mint',
  },
];

const META_CARDS: PhaseCard[] = [
  {
    group: 'meta',
    title: '팁 / FAQ / 용어사전',
    description: '운영 노하우 16종 · FAQ 7종 · 용어사전 30종 + 검색',
    to: '/tips',
    badge: 'Phase 6',
    badgeVariant: 'yellow',
  },
  {
    group: 'meta',
    title: '내 데이터 / 프리셋',
    description: '빌드 프리셋 저장·이름수정·삭제 + JSON 내보내기/가져오기',
    to: '/my-data',
    badge: 'Phase 2',
    badgeVariant: 'yellow',
  },
];

function CardGrid({ cards }: { cards: PhaseCard[] }) {
  return (
    <div className="home__grid">
      {cards.map(({ title, description, to, badge, badgeVariant }) => (
        <Link key={to} to={to} style={{ textDecoration: 'none' }}>
          <div className="home__phase-card">
            <div className="home__phase-name">
              <PixelBadge variant={badgeVariant}>{badge}</PixelBadge>
            </div>
            <div className="home__phase-title">{title}</div>
            <div style={{ fontSize: 11, color: 'var(--color-ink-muted)', lineHeight: 1.6, marginTop: 6 }}>
              {description}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

export function Home() {
  return (
    <div>
      <section className="home__hero">
        <h1 className="home__title">⚔ 여고리셋 계산기</h1>
        <p className="home__lead">
          "여고생과 리셋중" 데이터 분석·수치 계산 비공식 팬 사이트입니다.
          <br />
          게임이 보여주지 않는 시간당 자원·빌드 비교·자원 의사결정을 도와드립니다.
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <PixelBadge variant="pink">로그라이크×방치형</PixelBadge>
          <PixelBadge variant="sky">비공식 팬 사이트</PixelBadge>
          <PixelBadge variant="mint">Phase 12 완료</PixelBadge>
          <PixelBadge variant="gold">계산기 7종</PixelBadge>
        </div>
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>① 시작하기</h2>
        <p style={{ fontSize: 12, color: 'var(--color-ink-muted)', marginTop: 0, marginBottom: 12, lineHeight: 1.7 }}>
          먼저 <strong>내 빌드</strong>에서 인게임 스펙창의 33개 수치를 한 번 입력하세요. 이후 모든 계산기에서 자동 활용됩니다.
        </p>
        <CardGrid cards={CORE_CARDS} />
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>② 계산기</h2>
        <p style={{ fontSize: 12, color: 'var(--color-ink-muted)', marginTop: 0, marginBottom: 12, lineHeight: 1.7 }}>
          <strong>Phase 8~11</strong>은 33필드 통합 입력 기반 신규 계산기, <strong>Phase 3~5</strong>는 단일 시나리오 MVP 계산기입니다.
        </p>
        <CardGrid cards={CALC_CARDS} />
      </section>

      <section style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>③ 콘텐츠 & 데이터 관리</h2>
        <CardGrid cards={META_CARDS} />
      </section>

      <PixelCard title="사이트 이용 안내">
        <ul style={{ fontSize: 12, lineHeight: 2, paddingLeft: 16, margin: 0 }}>
          <li><strong>33필드 입력</strong> 한 번이면 4개 신규 계산기(시간당/의사결정/비교/DPS)에서 자동 사용</li>
          <li>모든 % 필드는 <code>K/M/G/T</code> 단위 입력 가능 (예: <code>1.5K%</code>)</li>
          <li><strong>고급 가정</strong> (치명타 기본 배수·DPS 비중·합성 빈도 등) 사용자 직접 보정 가능 — 결과 패널에 "사용자 보정" 배지 표시</li>
          <li>빌드 비교 페이지의 <strong>공유 URL</strong>로 친구와 빌드 공유 가능 (로그인 불필요)</li>
          <li>수치는 네이버 게임 라운지 + 인게임 이미지 분석 기반 추정치 (±5~10% 오차 가능)</li>
          <li>14단계 절망 1~100층 보스 HP/피격 표 + 코스튬 R/SR/SSR 계수 + VIP팩 누적 가치 등 풍부한 데이터</li>
          <li>데이터 저장: 비로그인 = LocalStorage / Google 로그인 = Firestore 자동 동기화</li>
          <li>오류·제안은 GitHub Issues로 제보해주세요</li>
        </ul>
      </PixelCard>
    </div>
  );
}
