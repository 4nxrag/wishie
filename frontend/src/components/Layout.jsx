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
        background: 'white',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        padding: '1rem 0',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div className="container" style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <h2 style={{ 
              color: 'var(--primary)', 
              fontSize: '1.5rem',
              fontWeight: '700'
            }}>
              🎉 Wishie
            </h2>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <NavLink 
                to="/today" 
                style={({ isActive }) => ({
                  textDecoration: 'none',
                  color: isActive ? 'var(--primary)' : 'var(--gray-700)',
                  fontWeight: isActive ? '600' : '500',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  background: isActive ? 'var(--gray-100)' : 'transparent'
                })}
              >
                Today
              </NavLink>
              
              <NavLink 
                to="/contacts" 
                style={({ isActive }) => ({
                  textDecoration: 'none',
                  color: isActive ? 'var(--primary)' : 'var(--gray-700)',
                  fontWeight: isActive ? '600' : '500',
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  background: isActive ? 'var(--gray-100)' : 'transparent'
                })}
              >
                Contacts
              </NavLink>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>
              {user?.name}
            </span>
            <button onClick={handleLogout} className="btn btn-secondary" style={{
              padding: '0.5rem 1rem',
              fontSize: '0.875rem'
            }}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '2rem 0' }}>
        <div className="container">
          <Outlet />
        </div>
      </main>

      {/* Offline Indicator */}
      {!navigator.onLine && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'var(--warning)',
          color: 'white',
          padding: '0.75rem 1.5rem',
          borderRadius: '8px',
          boxShadow: 'var(--shadow-md)',
          zIndex: 1000
        }}>
          📵 You're offline. Changes will sync when back online.
        </div>
      )}
    </div>
  );
};

export default Layout;
