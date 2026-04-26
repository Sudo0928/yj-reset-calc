import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LogIn, LogOut, User, Database } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { PixelButton } from '@/components/pixel';

const NAV_ITEMS = [
  { to: '/', label: '홈', end: true },
  { to: '/stats', label: '내 빌드' },
  { to: '/hourly', label: '시간당' },
  { to: '/damage', label: '데미지' },
  { to: '/gold', label: '골드/파편' },
  { to: '/chest', label: '상자 EV' },
  { to: '/tips', label: '팁/가이드' },
];

export function Header() {
  const { user, loading, signIn, signOut, firebaseEnabled } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="app-header">
      <div className="app-header__inner">
        <NavLink to="/" className="app-logo">
          ⚔ 여고리셋
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
          {firebaseEnabled ? (
            user ? (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setMenuOpen((o) => !o)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    padding: '4px 8px',
                    border: 'var(--border-pixel)',
                    background: 'var(--color-bg-base)',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                  aria-label="사용자 메뉴"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName ?? ''}
                      width={20}
                      height={20}
                      style={{ borderRadius: '50%' }}
                    />
                  ) : (
                    <User size={14} />
                  )}
                  <span style={{ maxWidth: 80, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user.displayName?.split(' ')[0] ?? '유저'}
                  </span>
                </button>

                {menuOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      marginTop: 4,
                      background: 'var(--color-bg-card)',
                      border: 'var(--border-pixel-thick)',
                      boxShadow: 'var(--shadow-pixel)',
                      zIndex: 100,
                      minWidth: 140,
                    }}
                  >
                    <NavLink
                      to="/my-data"
                      onClick={() => setMenuOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '8px 12px',
                        fontSize: 12,
                        fontWeight: 700,
                        borderBottom: 'var(--border-pixel)',
                      }}
                    >
                      <Database size={13} /> 내 데이터
                    </NavLink>
                    <button
                      onClick={() => { setMenuOpen(false); signOut(); }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '8px 12px',
                        fontSize: 12,
                        fontWeight: 700,
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontFamily: 'inherit',
                        color: 'var(--color-danger)',
                      }}
                    >
                      <LogOut size={13} /> 로그아웃
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <PixelButton
                size="sm"
                variant="primary"
                onClick={() => signIn()}
                disabled={loading}
              >
                <LogIn size={13} />
                {loading ? '...' : '로그인'}
              </PixelButton>
            )
          ) : (
            <NavLink to="/my-data" style={{ textDecoration: 'none' }}>
              <PixelButton size="sm" variant="ghost">
                <Database size={13} /> 내 데이터
              </PixelButton>
            </NavLink>
          )}
        </div>
      </div>
    </header>
  );
}
