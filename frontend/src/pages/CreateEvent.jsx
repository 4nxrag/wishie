import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const CreateEvent = () => {
  const { contactId } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    type: 'birthday',
    originalDate: '',
    notes: ''
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await api.post('/events', {
        ...formData,
        contactId
      });
      navigate(`/contacts/${contactId}`);
    } catch (err) {
      const errors = err.response?.data?.errors;
      if (errors && Array.isArray(errors)) {
        setError(errors.map(e => e.message).join(', '));
      } else {
        setError(err.response?.data?.message || 'Failed to create event');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const getEventIcon = (type) => {
    switch(type) {
      case 'birthday': return '🎂';
      case 'anniversary': return '💐';
      case 'pet_birthday': return '🐾';
      default: return '🎉';
    }
  };

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      {/* Back Button */}
      <button 
        onClick={() => navigate(`/contacts/${contactId}`)}
        style={{
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(10px)',
          border: '2px solid var(--glass-border)',
          borderRadius: '12px',
          color: 'var(--primary)',
          cursor: 'pointer',
          marginBottom: '1.5rem',
          fontSize: '1rem',
          fontWeight: '600',
          padding: '0.75rem 1.5rem',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateX(-5px)';
          e.currentTarget.style.borderColor = 'var(--primary-light)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateX(0)';
          e.currentTarget.style.borderColor = 'var(--glass-border)';
        }}
      >
        ← Back to Contact
      </button>

      {/* Form Card */}
      <div className="card" style={{ 
        maxWidth: '700px', 
        margin: '0 auto',
        border: '2px solid var(--primary-light)'
      }}>
        {/* Header */}
        <div style={{ 
          textAlign: 'center',
          marginBottom: '2rem',
          paddingBottom: '2rem',
          borderBottom: '2px solid var(--glass-border)'
        }}>
          <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>
            {getEventIcon(formData.type)}
          </div>
          <h1 style={{ 
            fontSize: '2.5rem',
            background: 'var(--gradient-primary)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontWeight: '800',
            marginBottom: '0.5rem'
          }}>
            Add New Event
          </h1>
          <p style={{ color: 'var(--gray-600)', fontSize: '1.05rem' }}>
            Create a birthday, anniversary, or special occasion
          </p>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Event Title *</label>
            <input
              type="text"
              className="form-input"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Mom's Birthday, Wedding Anniversary, etc."
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Event Type *</label>
            <select
              className="form-input"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              style={{ cursor: 'pointer' }}
            >
              <option value="birthday">🎂 Birthday</option>
              <option value="anniversary">💐 Anniversary</option>
              <option value="pet_birthday">🐾 Pet Birthday</option>
              <option value="other">🎉 Other</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Original Date *</label>
            <input
              type="date"
              className="form-input"
              value={formData.originalDate}
              onChange={(e) => setFormData({ ...formData, originalDate: e.target.value })}
              required
            />
            <small style={{ 
              color: 'var(--gray-500)', 
              fontSize: '0.875rem',
              display: 'block',
              marginTop: '0.5rem'
            }}>
              💡 The actual date when the person was born or event occurred (for age/year calculation)
            </small>
          </div>

          <div className="form-group">
            <label className="form-label">Notes (Optional)</label>
            <textarea
              className="form-input"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Gift ideas, favorite things, special preferences..."
              rows={4}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button 
              type="submit" 
              className="btn btn-primary btn-block"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <div className="spinner" style={{ width: '20px', height: '20px', margin: 0, borderWidth: '2px' }}></div>
                  Creating...
                </>
              ) : (
                '✨ Create Event'
              )}
            </button>
            <button 
              type="button"
              onClick={() => navigate(`/contacts/${contactId}`)}
              className="btn btn-secondary"
              style={{ flex: '0 0 auto', padding: '0.75rem 2rem' }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEvent;
