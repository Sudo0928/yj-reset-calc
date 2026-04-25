import { Link } from 'react-router-dom';
import { PixelCard, PixelBadge } from '@/components/pixel';

const PHASES = [
  { phase: 'Phase 3', title: '데미지 계산기', to: '/damage', status: 'wip', badge: '예정' as const },
  { phase: 'Phase 4', title: '골드/빛의파편 계산기', to: '/gold', status: 'wip', badge: '예정' as const },
  { phase: 'Phase 5', title: '상자 EV 계산기', to: '/chest', status: 'wip', badge: '예정' as const },
  { phase: 'Phase 6', title: '팁/FAQ/용어사전', to: '/tips', status: 'wip', badge: '예정' as const },
] satisfies Array<{ phase: string; title: string; to: string; status: string; badge: 'tbd' | '예정' | '완료' }>;

export function Home() {
  return (
    <div>
      <section className="home__hero">
        <h1 className="home__title">⚔ 여고리셋 계산기</h1>
        <p className="home__lead">
          "여고생과 리셋중" 데이터 분석·수치 계산 비공식 팬 사이트입니다.
          <br />
          수치는 추정치이며 인게임과 차이가 있을 수 있습니다.
        </p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <PixelBadge variant="pink">로그라이크×방치형</PixelBadge>
          <PixelBadge variant="sky">비공식</PixelBadge>
          <PixelBadge variant="tbd">Phase 1 진행 중</PixelBadge>
        </div>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>계산기</h2>
        <div className="home__grid">
          {PHASES.map(({ phase, title, to, badge }) => (
            <Link key={to} to={to} style={{ textDecoration: 'none' }}>
              <div className="home__phase-card">
                <div className="home__phase-name">{phase}</div>
                <div className="home__phase-title">{title}</div>
                <div className="home__phase-status">
                  <PixelBadge variant="tbd">{badge}</PixelBadge>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <PixelCard title="사이트 이용 안내">
        <ul style={{ fontSize: 12, lineHeight: 2, paddingLeft: 16, margin: 0 }}>
          <li>수치는 네이버 게임 라운지의 커뮤니티 분석 자료를 기반으로 역산한 추정치입니다.</li>
          <li>게임 업데이트로 실제 수치가 달라질 수 있습니다.</li>
          <li>오류 발견 시 GitHub Issues로 제보해주세요.</li>
          <li>데이터 저장 기능은 Phase 2에서 추가됩니다.</li>
        </ul>
      </PixelCard>
    </div>
  );
}
