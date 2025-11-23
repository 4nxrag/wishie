import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

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
    return <div className="spinner"></div>;
  }

  return (
    <div>
      {/* Today's Events */}
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
          Today's Events 🎉
        </h1>

        {todayEvents.length === 0 ? (
          <div className="card text-center">
            <p style={{ color: 'var(--gray-600)', fontSize: '1.1rem' }}>
              No events today. Enjoy your day! ☀️
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {todayEvents.map((event) => (
              <div key={event._id} className="card" style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'start'
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '2rem' }}>
                        {getEventIcon(event.type)}
                      </span>
                      <h3 style={{ fontSize: '1.5rem' }}>
                        {event.contactId?.name || 'Unknown'}
                      </h3>
                    </div>
                    <p style={{ fontSize: '1.1rem', opacity: 0.95 }}>
                      {event.title}
                    </p>
                    <p style={{ fontSize: '0.875rem', opacity: 0.9, marginTop: '0.5rem' }}>
                      📅 {formatDate(event.nextOccurrence)}
                    </p>
                    {event.notes && (
                      <p style={{ fontSize: '0.875rem', opacity: 0.85, marginTop: '0.5rem' }}>
                        💡 {event.notes}
                      </p>
                    )}
                  </div>
                  
                  <Link 
                    to={`/wish/${event._id}`}
                    className="btn"
                    style={{
                      background: 'white',
                      color: 'var(--primary)',
                      fontWeight: '600',
                      padding: '0.75rem 1.5rem'
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

      {/* Upcoming Events (Next 30 Days) */}
      <div>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
          Upcoming Events (Next 30 Days)
        </h2>

        {upcomingEvents.length === 0 ? (
          <div className="card text-center">
            <p style={{ color: 'var(--gray-600)' }}>
              No upcoming events in the next 30 days.
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {upcomingEvents.map((event) => {
              const daysUntil = getDaysUntil(event.nextOccurrence);
              const isToday = daysUntil === 0;
              const isUrgent = daysUntil <= 7;

              return (
                <div key={event._id} className="card">
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'start'
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '1.5rem' }}>
                          {getEventIcon(event.type)}
                        </span>
                        <h3 style={{ fontSize: '1.25rem' }}>
                          {event.contactId?.name || 'Unknown'}
                        </h3>
                      </div>
                      <p style={{ color: 'var(--gray-700)', marginBottom: '0.5rem' }}>
                        {event.title}
                      </p>
                      <p style={{ color: 'var(--gray-500)', fontSize: '0.875rem' }}>
                        📅 {formatDate(event.nextOccurrence)}
                      </p>
                    </div>
                    
                    <span style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '12px',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      background: isToday ? 'var(--danger)' : 
                                  isUrgent ? 'var(--warning)' : 
                                  'var(--success)',
                      color: 'white'
                    }}>
                      {isToday ? 'Today!' : `${daysUntil} day${daysUntil !== 1 ? 's' : ''}`}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      {todayEvents.length === 0 && upcomingEvents.length === 0 && (
        <div className="card text-center" style={{ marginTop: '2rem' }}>
          <p style={{ color: 'var(--gray-600)', marginBottom: '1rem' }}>
            No events yet? Get started!
          </p>
          <Link to="/contacts" className="btn btn-primary">
            Add Your First Contact
          </Link>
        </div>
      )}
    </div>
  );
};

export default Today;
