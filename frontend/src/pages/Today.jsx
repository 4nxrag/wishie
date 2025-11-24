import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

// Helper to decode HTML entities
const decodeHTML = (html) => {
  const txt = document.createElement('textarea');
  txt.innerHTML = html;
  return txt.value;
};

const Today = () => {
  const [todayEvents, setTodayEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const [todayRes, upcomingRes] = await Promise.all([
        api.get('/events/today'),
        api.get('/events/upcoming')
      ]);
      
      setTodayEvents(todayRes.data.data.events);
      setUpcomingEvents(upcomingRes.data.data.events);
    } catch (err) {
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDaysUntil = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDate = new Date(date);
    eventDate.setHours(0, 0, 0, 0);
    
    const diffTime = eventDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  const getEventIcon = (type) => {
    switch(type) {
      case 'birthday': return '🎂';
      case 'anniversary': return '💐';
      case 'pet_birthday': return '🐾';
      default: return '🎉';
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
      {/* Today's Events Section */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.75rem', 
          marginBottom: '1.5rem',
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(10px)',
          padding: '1rem 1.5rem',
          borderRadius: '16px',
          border: '2px solid var(--primary-light)'
        }}>
          <span style={{ fontSize: '2rem' }}>🎉</span>
          <h1 style={{ 
            fontSize: '2.5rem',
            background: 'var(--gradient-primary)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontWeight: '800',
            margin: 0
          }}>
            Today's Events
          </h1>
        </div>

        {todayEvents.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>☀️</div>
            <p style={{ 
              color: 'var(--gray-600)', 
              fontSize: '1.2rem',
              marginBottom: '0.5rem'
            }}>
              No events today
            </p>
            <p style={{ color: 'var(--gray-500)', fontSize: '0.95rem' }}>
              Enjoy your day! Check upcoming events below.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1.25rem' }}>
            {todayEvents.map((event) => (
              <div 
                key={event._id} 
                className="card" 
                style={{
                  background: 'var(--gradient-primary)',
                  color: 'white',
                  padding: '2rem',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Decorative circles */}
                <div style={{
                  position: 'absolute',
                  top: '-50px',
                  right: '-50px',
                  width: '150px',
                  height: '150px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '50%'
                }}></div>
                <div style={{
                  position: 'absolute',
                  bottom: '-30px',
                  left: '-30px',
                  width: '100px',
                  height: '100px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '50%'
                }}></div>

                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'start',
                  position: 'relative',
                  zIndex: 1
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '3rem' }}>
                        {getEventIcon(event.type)}
                      </span>
                      <h3 style={{ fontSize: '2rem', fontWeight: '700', margin: 0 }}>
                        {decodeHTML(event.contactId?.name || 'Unknown')}
                      </h3>
                    </div>
                    <p style={{ fontSize: '1.25rem', opacity: 0.95, marginBottom: '0.75rem' }}>
                      {decodeHTML(event.title)}
                    </p>
                    <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.95rem', opacity: 0.9 }}>
                      <span>📅 {formatDate(event.nextOccurrence)}</span>
                      {event.contactId?.relation && event.contactId.relation !== 'other' && (
                        <span style={{ 
                          textTransform: 'capitalize',
                          background: 'rgba(255, 255, 255, 0.2)',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '12px'
                        }}>
                          {event.contactId.relation}
                        </span>
                      )}
                    </div>
                    {event.notes && (
                      <p style={{ 
                        fontSize: '0.95rem', 
                        opacity: 0.85, 
                        marginTop: '1rem',
                        background: 'rgba(255, 255, 255, 0.15)',
                        padding: '0.75rem 1rem',
                        borderRadius: '8px'
                      }}>
                        💡 {decodeHTML(event.notes)}
                      </p>
                    )}
                  </div>
                  
                  <Link 
                    to={`/wish/${event._id}`}
                    className="btn"
                    style={{
                      background: 'white',
                      color: 'var(--primary)',
                      fontWeight: '700',
                      padding: '1rem 2rem',
                      fontSize: '1.05rem',
                      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
                      marginLeft: '1rem'
                    }}
                  >
                    Send Wish 🎁
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upcoming Events Section */}
<div>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.75rem', 
          marginBottom: '1.5rem',
          background: 'var(--glass-bg)',
          backdropFilter: 'blur(10px)',
          padding: '1rem 1.5rem',
          borderRadius: '16px',
          border: '2px solid var(--primary-light)'
        }}>
          <span style={{ fontSize: '2rem' }}>📅</span>
          <h2 style={{ 
            fontSize: '2rem',
            background: 'var(--gradient-primary)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontWeight: '700',
            margin: 0
          }}>
            Upcoming Events
          </h2>
          <span style={{ 
            fontSize: '0.875rem',
            color: 'var(--gray-500)',
            fontWeight: '600',
            background: 'rgba(236, 72, 153, 0.1)',
            padding: '0.25rem 0.75rem',
            borderRadius: '12px'
          }}>
            Next 30 Days
          </span>
        </div>

        {upcomingEvents.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📭</div>
            <p style={{ color: 'var(--gray-600)', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
              No upcoming events in the next 30 days
            </p>
            <Link 
              to="/contacts" 
              className="btn btn-primary"
              style={{ marginTop: '1rem', display: 'inline-flex' }}
            >
              Add Your First Event
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {upcomingEvents.map((event) => {
              const daysUntil = getDaysUntil(event.nextOccurrence);
              const isToday = daysUntil === 0;
              const isUrgent = daysUntil <= 7;

              return (
                <div 
                  key={event._id} 
                  className="card"
                  style={{
                    transition: 'all 0.3s ease',
                    border: isUrgent && !isToday ? '2px solid var(--warning)' : '1px solid var(--glass-border)'
                  }}
                >
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1.5rem'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                      <span style={{ fontSize: '2.5rem' }}>
                        {getEventIcon(event.type)}
                      </span>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ 
                          fontSize: '1.35rem', 
                          fontWeight: '700',
                          color: 'var(--gray-900)',
                          marginBottom: '0.25rem'
                        }}>
                          {decodeHTML(event.contactId?.name || 'Unknown')}
                        </h3>
                        <p style={{ 
                          color: 'var(--gray-600)', 
                          marginBottom: '0.5rem',
                          fontSize: '0.95rem'
                        }}>
                          {decodeHTML(event.title)}
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                          <span style={{ 
                            color: 'var(--gray-500)', 
                            fontSize: '0.875rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem'
                          }}>
                            📅 {formatDate(event.nextOccurrence)}
                          </span>
                          {event.contactId?.relation && event.contactId.relation !== 'other' && (
                            <span className="badge" style={{ fontSize: '0.75rem' }}>
                              {event.contactId.relation}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <span style={{
                      padding: '0.625rem 1.25rem',
                      borderRadius: '16px',
                      fontSize: '0.875rem',
                      fontWeight: '700',
                      background: isToday ? 'var(--danger)' : 
                                  isUrgent ? 'var(--warning)' : 
                                  'var(--success)',
                      color: 'white',
                      minWidth: '80px',
                      textAlign: 'center',
                      boxShadow: 'var(--shadow-sm)'
                    }}>
                      {isToday ? '🔥 Today!' : `${daysUntil}d`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Empty State - Add First Event */}
      {todayEvents.length === 0 && upcomingEvents.length === 0 && (
        <div className="card" style={{ 
          textAlign: 'center', 
          padding: '4rem 2rem',
          marginTop: '2rem',
          background: 'var(--gradient-primary)',
          color: 'white'
        }}>
          <div style={{ fontSize: '5rem', marginBottom: '1.5rem' }}>🎊</div>
          <h2 style={{ fontSize: '2rem', marginBottom: '1rem', fontWeight: '700' }}>
            Welcome to Wishie!
          </h2>
          <p style={{ fontSize: '1.1rem', marginBottom: '2rem', opacity: 0.95 }}>
            Never forget a birthday again. Start by adding your first contact.
          </p>
          <Link 
            to="/contacts" 
            className="btn"
            style={{
              background: 'white',
              color: 'var(--primary)',
              fontWeight: '700',
              padding: '1rem 2.5rem',
              fontSize: '1.1rem',
              display: 'inline-flex'
            }}
          >
            🚀 Get Started
          </Link>
        </div>
      )}
    </div>
  );
};

export default Today;
