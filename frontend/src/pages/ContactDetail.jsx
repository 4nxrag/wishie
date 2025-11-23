import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

const ContactDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contact, setContact] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContact();
  }, [id]);

  const fetchContact = async () => {
    try {
      const response = await api.get(`/contacts/${id}`);
      setContact(response.data.data.contact);
      setEvents(response.data.data.events || []);
    } catch (err) {
      console.error('Error fetching contact:', err);
      navigate('/contacts');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!confirm('Delete this event?')) return;

    try {
      await api.delete(`/events/${eventId}`);
      fetchContact();
    } catch (err) {
      alert('Failed to delete event');
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="spinner"></div>;
  }

  if (!contact) {
    return <div>Contact not found</div>;
  }

  return (
    <div>
      <button 
        onClick={() => navigate('/contacts')}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--primary)',
          cursor: 'pointer',
          marginBottom: '1rem',
          fontSize: '1rem'
        }}
      >
        ← Back to Contacts
      </button>

      {/* Contact Info */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
          {contact.name}
        </h1>
        <p style={{ color: 'var(--gray-600)', marginBottom: '0.5rem' }}>
          📞 {contact.phone}
        </p>
        {contact.relation !== 'other' && (
          <span style={{
            display: 'inline-block',
            padding: '0.25rem 0.75rem',
            background: 'var(--gray-100)',
            color: 'var(--primary)',
            borderRadius: '12px',
            fontSize: '0.875rem',
            fontWeight: '600',
            textTransform: 'capitalize',
            marginTop: '0.5rem'
          }}>
            {contact.relation}
          </span>
        )}
        {contact.notes && (
          <p style={{ 
            color: 'var(--gray-500)',
            marginTop: '1rem',
            padding: '1rem',
            background: 'var(--gray-50)',
            borderRadius: '6px'
          }}>
            {contact.notes}
          </p>
        )}
      </div>

      {/* Events Section */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '1rem'
      }}>
        <h2 style={{ fontSize: '1.5rem' }}>Events</h2>
        <Link 
          to={`/events/create/${contact._id}`}
          className="btn btn-primary"
        >
          + Add Event
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="card text-center">
          <p style={{ color: 'var(--gray-600)' }}>
            No events yet. Add a birthday or anniversary! 👆
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {events.map((event) => (
            <div key={event._id} className="card">
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'start'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '1.5rem' }}>
                      {event.type === 'birthday' ? '🎂' : 
                       event.type === 'anniversary' ? '💐' :
                       event.type === 'pet_birthday' ? '🐾' : '🎉'}
                    </span>
                    <h3 style={{ fontSize: '1.25rem' }}>{event.title}</h3>
                  </div>
                  <p style={{ color: 'var(--gray-600)', fontSize: '0.875rem' }}>
                    Original: {formatDate(event.originalDate)}
                  </p>
                  <p style={{ color: 'var(--primary)', fontWeight: '600', marginTop: '0.25rem' }}>
                    Next: {formatDate(event.nextOccurrence)}
                  </p>
                  {event.notes && (
                    <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                      {event.notes}
                    </p>
                  )}
                </div>
                <button 
                  onClick={() => handleDeleteEvent(event._id)}
                  className="btn btn-danger"
                  style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactDetail;
