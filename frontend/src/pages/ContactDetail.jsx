import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

// Helper to decode HTML entities
const decodeHTML = (html) => {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
};

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

  const getEventIcon = (type) => {
    switch(type) {
      case 'birthday': return '🎂';
      case 'anniversary': return '💐';
      case 'pet_birthday': return '🐾';
      default: return '🎉';
    }
  };

  const getRelationIcon = (relation) => {
    switch(relation) {
      case 'girlfriend': return '💕';
      case 'boyfriend': return '💙';
      case 'friend': return '🤝';
      case 'family': return '👨‍👩‍👧‍👦';
      case 'colleague': return '💼';
      default: return '👤';
    }
  };

  const getRelationColor = (relation) => {
    switch(relation) {
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

  if (!contact) {
    return <div>Contact not found</div>;
  }

  return (
    <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
      {/* Back Button */}
      <button 
        onClick={() => navigate('/contacts')}
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
        ← Back to Contacts
      </button>

      {/* Contact Info Card */}
      <div className="card" style={{ 
        marginBottom: '2rem',
        background: `linear-gradient(135deg, ${getRelationColor(contact.relation)} 0%, ${getRelationColor(contact.relation)}dd 100%)`,
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Decorative circles */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '200px',
          height: '200px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%'
        }}></div>
        <div style={{
          position: 'absolute',
          bottom: '-30px',
          left: '-30px',
          width: '150px',
          height: '150px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '50%'
        }}></div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Avatar + Name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.25)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '3rem',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
              border: '4px solid rgba(255, 255, 255, 0.3)'
            }}>
              {getRelationIcon(contact.relation)}
            </div>
            <div>
              <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem', fontWeight: '800' }}>
                {decodeHTML(contact.name)}
              </h1>
              {contact.relation !== 'other' && (
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1.25rem',
                  background: 'rgba(255, 255, 255, 0.25)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: '16px',
                  fontSize: '1rem',
                  fontWeight: '700',
                  textTransform: 'capitalize',
                  border: '2px solid rgba(255, 255, 255, 0.3)'
                }}>
                  {getRelationIcon(contact.relation)} {contact.relation}
                </span>
              )}
            </div>
          </div>

          {/* Contact Details */}
          <div style={{ 
            display: 'flex',
            gap: '2rem',
            fontSize: '1.1rem',
            marginBottom: '1rem'
          }}>
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(255, 255, 255, 0.15)',
              padding: '0.75rem 1.25rem',
              borderRadius: '12px'
            }}>
              📞 {contact.phone}
            </div>
          </div>

          {/* Notes */}
          {contact.notes && (
            <div style={{ 
              background: 'rgba(255, 255, 255, 0.15)',
              padding: '1.25rem',
              borderRadius: '12px',
              fontSize: '1rem',
              lineHeight: '1.6',
              backdropFilter: 'blur(10px)',
              border: '2px solid rgba(255, 255, 255, 0.2)'
            }}>
              💡 {decodeHTML(contact.notes)}
            </div>
          )}
        </div>
      </div>

      {/* Events Section */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '1.5rem',
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(10px)',
        padding: '1rem 1.5rem',
        borderRadius: '16px',
        border: '2px solid var(--primary-light)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '2rem' }}>🎉</span>
          <h2 style={{ 
            fontSize: '2rem',
            background: 'var(--gradient-primary)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontWeight: '700',
            margin: 0
          }}>
            Events
          </h2>
          {events.length > 0 && (
            <span style={{
              background: 'var(--gradient-primary)',
              color: 'white',
              padding: '0.25rem 0.75rem',
              borderRadius: '12px',
              fontSize: '0.875rem',
              fontWeight: '700'
            }}>
              {events.length}
            </span>
          )}
        </div>
        <Link 
          to={`/events/create/${contact._id}`}
          className="btn btn-primary"
        >
          + Add Event
        </Link>
      </div>

      {/* Events List */}
      {events.length === 0 ? (
        <div className="card" style={{ 
          textAlign: 'center',
          padding: '4rem 2rem',
          background: 'var(--gradient-primary)',
          color: 'white'
        }}>
          <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>🎂</div>
          <h3 style={{ fontSize: '2rem', marginBottom: '1rem', fontWeight: '700' }}>
            No Events Yet
          </h3>
          <p style={{ fontSize: '1.1rem', marginBottom: '2rem', opacity: 0.95 }}>
            Add a birthday or anniversary for {decodeHTML(contact.name)}
          </p>
          <Link 
            to={`/events/create/${contact._id}`}
            className="btn"
            style={{
              background: 'white',
              color: 'var(--primary)',
              fontWeight: '700',
              padding: '1rem 2.5rem',
              fontSize: '1.1rem'
            }}
          >
            + Add First Event
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1rem' }}>
          {events.map((event) => (
            <div key={event._id} className="card">
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'start',
                gap: '1.5rem'
              }}>
                <div style={{ flex: 1, display: 'flex', gap: '1rem' }}>
                  <span style={{ fontSize: '3rem' }}>
                    {getEventIcon(event.type)}
                  </span>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ 
                      fontSize: '1.5rem',
                      fontWeight: '700',
                      color: 'var(--gray-900)',
                      marginBottom: '0.5rem'
                    }}>
                      {decodeHTML(event.title)}
                    </h3>
                    <div style={{ 
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.5rem',
                      fontSize: '0.95rem',
                      color: 'var(--gray-600)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span>📅</span>
                        <span>Original: {formatDate(event.originalDate)}</span>
                      </div>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '0.5rem',
                        color: 'var(--primary)',
                        fontWeight: '600'
                      }}>
                        <span>🔔</span>
                        <span>Next: {formatDate(event.nextOccurrence)}</span>
                      </div>
                    </div>
                    {event.notes && (
                      <p style={{ 
                        color: 'var(--gray-500)', 
                        fontSize: '0.875rem', 
                        marginTop: '0.75rem',
                        background: 'var(--gray-50)',
                        padding: '0.75rem 1rem',
                        borderRadius: '8px',
                        borderLeft: '3px solid var(--primary)'
                      }}>
                        💡 {decodeHTML(event.notes)}
                      </p>
                    )}
                  </div>
                </div>
                <button 
                  onClick={() => handleDeleteEvent(event._id)}
                  className="btn btn-danger"
                  style={{ padding: '0.75rem 1rem', fontSize: '0.95rem' }}
                >
                  🗑️ Delete
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
