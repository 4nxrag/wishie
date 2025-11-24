import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(name, email, password);
      navigate('/today');
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (errors && Array.isArray(errors)) {
        setError(errors.map(e => e.message).join(', '));
      } else {
        setError(err.response?.data?.message || 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--gradient-light)',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated Background Blobs */}
      <div style={{
        position: 'absolute',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 70%)',
        borderRadius: '50%',
        top: '-10%',
        right: '-10%',
        animation: 'float 20s ease-in-out infinite',
        pointerEvents: 'none'
      }}></div>
      <div style={{
        position: 'absolute',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
        borderRadius: '50%',
        bottom: '-10%',
        left: '-10%',
        animation: 'float 15s ease-in-out infinite reverse',
        pointerEvents: 'none'
      }}></div>

      {/* Register Card */}
      <div className="card" style={{ 
        maxWidth: '440px', 
        width: '100%',
        animation: 'slideDown 0.5s ease-out'
      }}>
        {/* Logo & Title */}
        <div className="text-center mb-2" style={{ marginBottom: '2rem' }}>
          <div style={{ 
            fontSize: '4rem', 
            marginBottom: '1rem',
            animation: 'bounce 2s ease-in-out infinite'
          }}>
            🎉
          </div>
          <h1 style={{ 
            fontSize: '2.5rem', 
            marginBottom: '0.5rem',
            background: 'var(--gradient-primary)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontWeight: '800'
          }}>
            Wishie
          </h1>
          <p style={{ color: 'var(--gray-600)', fontSize: '1.05rem' }}>
            Create your account to get started
          </p>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              required
              autoComplete="name"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                required
                minLength={6}
                autoComplete="new-password"
                style={{ paddingRight: '3rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '1.25rem',
                  transition: 'transform 0.2s ease',
                  padding: '0.5rem'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(-50%) scale(1)'}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            <small style={{ color: 'var(--gray-500)', fontSize: '0.875rem', marginTop: '0.25rem', display: 'block' }}>
              Must contain uppercase, lowercase, and number
            </small>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-block"
            disabled={loading}
            style={{ marginTop: '1.5rem' }}
          >
            {loading ? (
              <>
                <div className="spinner" style={{ width: '20px', height: '20px', margin: 0, borderWidth: '2px' }}></div>
                Creating account...
              </>
            ) : (
              '✨ Create Account'
            )}
          </button>
        </form>

        <div style={{ 
          textAlign: 'center', 
          marginTop: '1.5rem',
          padding: '1rem 0',
          borderTop: '1px solid var(--glass-border)'
        }}>
          <p style={{ color: 'var(--gray-600)', marginBottom: '0.5rem' }}>
            Already have an account?
          </p>
          <Link to="/login" style={{ 
            color: 'var(--primary)', 
            textDecoration: 'none',
            fontWeight: '700',
            fontSize: '1.05rem',
            transition: 'all 0.3s ease',
            display: 'inline-block'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >
            Login →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
