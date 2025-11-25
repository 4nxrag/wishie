import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

// Helper to decode HTML entities
const decodeHTML = (html) => {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
};

const Contacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    relation: 'other',
    notes: ''
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await api.get('/contacts');
      setContacts(response.data.data.contacts);
    } catch (err) {
      console.error('Error fetching contacts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await api.post('/contacts', formData);
      setShowForm(false);
      setFormData({ name: '', phone: '', relation: 'other', notes: '' });
      fetchContacts();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create contact');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this contact and all associated events?')) return;

    try {
      await api.delete(`/contacts/${id}`);
      fetchContacts();
    } catch (err) {
      alert('Failed to delete contact');
    }
  };

  const getRelationIcon = (relation) => {
    switch (relation) {
      case 'girlfriend': return '💕';
      case 'boyfriend': return '💙';
      case 'friend': return '🤝';
      case 'family': return '👨‍👩‍👧‍👦';
      case 'colleague': return '💼';
      default: return '👤';
    }
  };

  const getRelationColor = (relation) => {
    switch (relation) {
      case 'girlfriend': return '#ec4899';
      case 'boyfriend': return '#3b82f6';
      case 'friend': return '#10b981';
      case 'family': return '#f59e0b';
      case 'colleague': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(10px)',
        padding: '1.5rem',
        borderRadius: '16px',
        border: '2px solid var(--primary-light)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '2rem' }}>👥</span>
          <h1 style={{
            fontSize: '2.5rem',
            background: 'var(--gradient-primary)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontWeight: '800',
            margin: 0
          }}>
            Contacts
          </h1>
          {contacts.length > 0 && (
            <span style={{
              background: 'var(--gradient-primary)',
              color: 'white',
              padding: '0.25rem 0.75rem',
              borderRadius: '12px',
              fontSize: '0.875rem',
              fontWeight: '700'
            }}>
              {contacts.length}
            </span>
          )}
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '1rem'
          }}
        >
          {showForm ? '✕ Cancel' : '+ Add Contact'}
        </button>
      </div>

      {/* Add Contact Form */}
      {showForm && (
        <div className="card" style={{
          marginBottom: '2rem',
          animation: 'slideDown 0.3s ease-out',
          border: '2px solid var(--primary-light)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>✨</span>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: 'var(--gray-900)',
              margin: 0
            }}>
              Add New Contact
            </h3>
          </div>

          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                className="form-input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <input
                type="tel"
                className="form-input"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+919876543210"
                required
              />
              <small style={{ color: 'var(--gray-500)', fontSize: '0.875rem', display: 'block', marginTop: '0.5rem' }}>
                💡 Include country code (e.g., +91 for India) for WhatsApp
              </small>
            </div>

            <div className="form-group">
              <label className="form-label">Relation</label>
              <select
                className="form-input"
                value={formData.relation}
                onChange={(e) => setFormData({ ...formData, relation: e.target.value })}
                style={{ cursor: 'pointer' }}
              >
                <option value="other">👤 Other</option>
                <option value="girlfriend">💕 Girlfriend</option>
                <option value="boyfriend">💙 Boyfriend</option>
                <option value="friend">🤝 Friend</option>
                <option value="family">👨‍👩‍👧‍👦 Family</option>
                <option value="colleague">💼 Colleague</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Notes (Optional)</label>
              <textarea
                className="form-input"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Gift preferences, favorite things, etc."
                rows={3}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-block"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <div className="spinner" style={{ width: '20px', height: '20px', margin: 0, borderWidth: '2px' }}></div>
                  Adding...
                </>
              ) : (
                '✨ Add Contact'
              )}
            </button>
          </form>
        </div>
      )}

      {/* Contacts List */}
      {contacts.length === 0 ? (
        <div className="card" style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          background: 'var(--gradient-primary)',
          color: 'white'
        }}>
          <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>📇</div>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem', fontWeight: '700' }}>
            No Contacts Yet
          </h2>
          <p style={{ fontSize: '1.1rem', marginBottom: '2rem', opacity: 0.95 }}>
            Add your first contact to start tracking birthdays and anniversaries!
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="btn"
            style={{
              background: 'white',
              color: 'var(--primary)',
              fontWeight: '700',
              padding: '1rem 2.5rem',
              fontSize: '1.1rem'
            }}
          >
            + Add Your First Contact
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {contacts.map((contact) => (
            <div
              key={contact._id}
              className="card"
              style={{
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = 'var(--shadow-lg), var(--shadow-glow)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--shadow-md)';
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'start',
                gap: '1.5rem'
              }}>
                <div style={{ flex: 1, display: 'flex', gap: '1.25rem', alignItems: 'start' }}>
                  {/* Avatar */}
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${getRelationColor(contact.relation)} 0%, ${getRelationColor(contact.relation)}dd 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.75rem',
                    boxShadow: `0 4px 12px ${getRelationColor(contact.relation)}40`,
                    flexShrink: 0
                  }}>
                    {getRelationIcon(contact.relation)}
                  </div>

                  {/* Contact Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h3 style={{
                      fontSize: '1.25rem',
                      marginBottom: '0.5rem',
                      fontWeight: '700',
                      color: 'var(--gray-900)',
                      wordBreak: 'break-word' // Prevent overflow
                    }}>
                      {decodeHTML(contact.name)}
                    </h3>
                    <p style={{
                      color: 'var(--gray-600)',
                      marginBottom: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      fontSize: '0.95rem'
                    }}>
                      <span>📞</span> {contact.phone}
                    </p>
                    {contact.relation !== 'other' && (
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.375rem 1rem',
                        background: `${getRelationColor(contact.relation)}15`,
                        color: getRelationColor(contact.relation),
                        borderRadius: '12px',
                        fontSize: '0.875rem',
                        fontWeight: '700',
                        textTransform: 'capitalize',
                        border: `2px solid ${getRelationColor(contact.relation)}30`
                      }}>
                        {getRelationIcon(contact.relation)} {contact.relation}
                      </span>
                    )}
                    {contact.notes && (
                      <p style={{
                        color: 'var(--gray-500)',
                        fontSize: '0.875rem',
                        marginTop: '0.75rem',
                        lineHeight: '1.5',
                        background: 'var(--gray-50)',
                        padding: '0.75rem 1rem',
                        borderRadius: '8px',
                        borderLeft: `3px solid ${getRelationColor(contact.relation)}`
                      }}>
                        💡 {decodeHTML(contact.notes)}
                      </p>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="btn-group">
                  <button
                    onClick={() => navigate(`/contacts/${contact._id}`)}
                    className="btn btn-primary"
                  >
                    View Details
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(contact._id);
                    }}
                    className="btn btn-danger"
                  >
                    🗑️
                  </button>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Contacts;
