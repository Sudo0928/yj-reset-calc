export function Footer() {
  return (
    <footer className="app-footer">
      <p>
        비공식 팬 사이트 · 게임 © 원작사 ·{' '}
        <a
          href="https://game.naver.com/lounge/reworld/home"
          target="_blank"
          rel="noreferrer"
        >
          네이버 게임 라운지
        </a>
      </p>
      <p style={{ marginTop: 4 }}>
        수치는 추정치입니다 — 인게임과 ±5% 오차가 있을 수 있습니다 ·{' '}
        <a
          href="https://github.com/Sudo0928/yj-reset-calc/issues"
          target="_blank"
          rel="noreferrer"
        >
          오류 신고
        </a>{' '}
        ·{' '}
        <a
          href="https://github.com/Sudo0928/yj-reset-calc"
          target="_blank"
          rel="noreferrer"
        >
          GitHub
        </a>
      </p>
    </footer>
  );
}
