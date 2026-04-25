import { NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/', label: '홈', end: true },
  { to: '/damage', label: '데미지 계산기' },
  { to: '/gold', label: '골드/파편' },
  { to: '/chest', label: '상자 EV' },
  { to: '/tips', label: '팁/가이드' },
];

export function Header() {
  return (
    <header className="app-header">
      <div className="app-header__inner">
        <NavLink to="/" className="app-logo">
          ⚔ 여고리셋 계산기
        </NavLink>

        <nav className="app-nav" aria-label="주 내비게이션">
          {NAV_ITEMS.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `app-nav__link${isActive ? ' app-nav__link--active' : ''}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="app-header__actions">
          <span
            style={{ fontSize: 11, color: 'var(--color-ink-muted)', whiteSpace: 'nowrap' }}
          >
            Phase 1 🚧
          </span>
        </div>
      </div>
    </header>
  );
}
