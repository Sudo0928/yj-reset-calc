import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header className="app-header">
      <Link to="/" className="app-logo">
        여고리셋 계산기
      </Link>
      <nav className="app-nav">
        <span className="app-nav__placeholder">Phase 1에서 추가</span>
      </nav>
    </header>
  );
}
