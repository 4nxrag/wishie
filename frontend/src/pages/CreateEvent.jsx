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

  return (
    <div>
      <button 
        onClick={() => navigate(`/contacts/${contactId}`)}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--primary)',
          cursor: 'pointer',
          marginBottom: '1rem',
          fontSize: '1rem'
        }}
      >
        ← Back to Contact
      </button>

      <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>
          Add New Event
        </h1>

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
              placeholder="Mom's Birthday"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Event Type *</label>
            <select
              className="form-input"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
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
            <small style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>
              The actual date when the person was born (for age calculation)
            </small>
          </div>

          <div className="form-group">
            <label className="form-label">Notes (Optional)</label>
            <textarea
              className="form-input"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Gift ideas, preferences, etc."
              rows={3}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              type="submit" 
              className="btn btn-primary btn-block"
              disabled={submitting}
            >
              {submitting ? 'Creating...' : 'Create Event'}
            </button>
            <button 
              type="button"
              onClick={() => navigate(`/contacts/${contactId}`)}
              className="btn btn-secondary"
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
