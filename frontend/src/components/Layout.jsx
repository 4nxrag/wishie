import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navbar */}
      <nav style={{
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0 4px 30px rgba(236, 72, 153, 0.1)',
        padding: '1rem 0',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        borderBottom: '1px solid var(--glass-border)'
      }}>
        <div className="container" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1rem',
          flexWrap: 'wrap' // Allow wrapping on very small screens
        }}>
          {/* Logo & Nav Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
            {/* Logo */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              cursor: 'pointer'
            }}
              onClick={() => navigate('/today')}
            >
              <span style={{ fontSize: '2rem' }}>🎉</span>
              <h2 style={{
                background: 'var(--gradient-primary)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                fontSize: '1.5rem',
                fontWeight: '800',
                letterSpacing: '-0.5px'
              }}>
                Wishie
              </h2>
            </div>

            {/* Nav Links */}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <NavLink
                to="/today"
                style={({ isActive }) => ({
                  textDecoration: 'none',
                  color: isActive ? 'white' : 'var(--gray-700)',
                  fontWeight: '600',
                  padding: '0.5rem 1rem',
                  borderRadius: '12px',
                  background: isActive ? 'var(--gradient-primary)' : 'transparent',
                  transition: 'all 0.3s ease',
                  fontSize: '0.875rem',
                  display: 'inline-block'
                })}
                onMouseEnter={(e) => {
                  if (!e.currentTarget.classList.contains('active')) {
                    e.currentTarget.style.background = 'rgba(236, 72, 153, 0.1)';
                    e.currentTarget.style.color = 'var(--primary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!e.currentTarget.classList.contains('active')) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--gray-700)';
                  }
                }}
              >
                📅 Today
              </NavLink>

              <NavLink
                to="/contacts"
                style={({ isActive }) => ({
                  textDecoration: 'none',
                  color: isActive ? 'white' : 'var(--gray-700)',
                  fontWeight: '600',
                  padding: '0.5rem 1rem',
                  borderRadius: '12px',
                  background: isActive ? 'var(--gradient-primary)' : 'transparent',
                  transition: 'all 0.3s ease',
                  fontSize: '0.875rem',
                  display: 'inline-block'
                })}
                onMouseEnter={(e) => {
                  if (!e.currentTarget.classList.contains('active')) {
                    e.currentTarget.style.background = 'rgba(236, 72, 153, 0.1)';
                    e.currentTarget.style.color = 'var(--primary)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!e.currentTarget.classList.contains('active')) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--gray-700)';
                  }
                }}
              >
                👥 Contacts
              </NavLink>
            </div>
          </div>

          {/* User Info & Logout */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            background: 'rgba(255, 255, 255, 0.5)',
            padding: '0.5rem 0.75rem 0.5rem 1.25rem',
            borderRadius: '50px',
            backdropFilter: 'blur(10px)',
            border: '1px solid var(--glass-border)'
          }}>
            {/* User Avatar & Name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                width: '32px', // Smaller avatar
                height: '32px',
                borderRadius: '50%',
                background: 'var(--gradient-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: '700',
                fontSize: '0.875rem',
                boxShadow: '0 4px 12px rgba(236, 72, 153, 0.3)',
                flexShrink: 0
              }}>
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <span style={{
                color: 'var(--gray-900)',
                fontSize: '0.875rem',
                fontWeight: '600',
                display: 'none' // Hide name on very small screens
              }}
                className="user-name"
              >
                {user?.name}
              </span>
            </div>

            {/* Divider */}
            <div style={{
              width: '1px',
              height: '24px',
              background: 'var(--glass-border)'
            }}></div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--gray-700)',
                cursor: 'pointer',
                padding: '0.5rem',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                transition: 'all 0.3s ease',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                e.currentTarget.style.color = 'var(--danger)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--gray-700)';
              }}
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{
        flex: 1,
        padding: '2.5rem 0',
        animation: 'fadeIn 0.5s ease-out'
      }}>
        <div className="container">
          <Outlet />
        </div>
      </main>

      {/* Footer (Optional) */}
      <footer style={{
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(20px)',
        padding: '1.5rem 0',
        borderTop: '1px solid var(--glass-border)',
        textAlign: 'center',
        color: 'var(--gray-600)',
        fontSize: '0.875rem'
      }}>
        <div className="container">
          Made with 💖 by <span style={{ fontWeight: '600', color: 'var(--primary)' }}>Anurag</span> · Never Forget a Birthday Again
        </div>
      </footer>

      {/* Offline Indicator */}
      {!navigator.onLine && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'var(--warning)',
          color: 'white',
          padding: '0.875rem 1.5rem',
          borderRadius: '12px',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 1000,
          fontWeight: '600',
          animation: 'slideUp 0.3s ease-out'
        }}>
          📵 You're offline. Changes will sync when back online.
        </div>
      )}
    </div>
  );
};

export default Layout;
