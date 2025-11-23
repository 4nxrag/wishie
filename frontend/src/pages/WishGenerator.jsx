import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

const WishGenerator = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  
  const [event, setEvent] = useState(null);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [generatedWish, setGeneratedWish] = useState('');
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchData();
  }, [eventId]);

const fetchData = async () => {
  try {
    console.log('Fetching data for event:', eventId); // Debug log
    
    // Fetch event details
    const eventRes = await api.get(`/events`);
    console.log('All events:', eventRes.data); // Debug log
    
    const foundEvent = eventRes.data.data.events.find(e => e._id === eventId);
    
    if (!foundEvent) {
      alert('Event not found');
      navigate('/today');
      return;
    }
    
    console.log('Found event:', foundEvent); // Debug log
    setEvent(foundEvent);

    // Fetch ALL templates first (remove filtering for debugging)
    console.log('Fetching templates...'); // Debug log
    const templatesRes = await api.get('/templates');
    console.log('Templates response:', templatesRes.data); // Debug log
    
    const allTemplates = templatesRes.data.data.templates;
    
    // Filter on frontend side
    const relation = foundEvent.contactId?.relation || 'general';
    const eventType = foundEvent.type;
    
    console.log('Filtering by:', { relation, eventType }); // Debug log
    
    // Show templates that match relation OR are general, AND match event type OR are 'all'
    const filteredTemplates = allTemplates.filter(t => {
      const matchesRelation = t.category === relation || t.category === 'general';
      const matchesEventType = t.eventType === eventType || t.eventType === 'all';
      return matchesRelation && matchesEventType;
    });
    
    console.log('Filtered templates:', filteredTemplates); // Debug log
    
    // If no matches, show all general templates
    const templatesToShow = filteredTemplates.length > 0 
      ? filteredTemplates 
      : allTemplates.filter(t => t.category === 'general');
    
    console.log('Final templates to show:', templatesToShow); // Debug log
    setTemplates(templatesToShow);
    
    // Auto-select first template
    if (templatesToShow.length > 0) {
      setSelectedTemplate(templatesToShow[0]);
    }
    
  } catch (err) {
    console.error('Error fetching data:', err);
    console.error('Error response:', err.response?.data); // Debug log
    alert('Failed to load data');
  } finally {
    setLoading(false);
  }
};


  const handleGenerate = async () => {
    if (!selectedTemplate) {
      alert('Please select a template');
      return;
    }

    setGenerating(true);

    try {
      const response = await api.post('/wishes/generate', {
        eventId: event._id,
        templateId: selectedTemplate._id
      });

      setGeneratedWish(response.data.data.message);
    } catch (err) {
      console.error('Error generating wish:', err);
      alert('Failed to generate wish');
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedWish);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <button 
        onClick={() => navigate('/today')}
        style={{
          background: 'none',
          border: 'none',
          color: 'var(--primary)',
          cursor: 'pointer',
          marginBottom: '1.5rem',
          fontSize: '1rem',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => e.target.style.transform = 'translateX(-5px)'}
        onMouseLeave={(e) => e.target.style.transform = 'translateX(0)'}
      >
        ← Back to Today
      </button>

      {/* Event Info Card */}
      <div className="card" style={{
        background: 'var(--gradient-primary)',
        color: 'white',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '3rem' }}>{getEventIcon(event.type)}</span>
          <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem' }}>
              {event.contactId?.name || 'Unknown'}
            </h1>
            <p style={{ fontSize: '1.1rem', opacity: 0.95 }}>
              {event.title}
            </p>
          </div>
        </div>
        {event.notes && (
          <p style={{ opacity: 0.9, marginTop: '1rem', fontSize: '0.95rem' }}>
            💡 {event.notes}
          </p>
        )}
      </div>

      {/* Template Selection */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>
          Choose a Template ✨
        </h2>
        
        {templates.length === 0 ? (
          <p style={{ color: 'var(--gray-600)' }}>No templates found for this event type.</p>
        ) : (
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {templates.map((template) => (
              <div
                key={template._id}
                onClick={() => setSelectedTemplate(template)}
                style={{
                  padding: '1rem',
                  borderRadius: '12px',
                  border: `2px solid ${selectedTemplate?._id === template._id ? 'var(--primary)' : 'var(--glass-border)'}`,
                  background: selectedTemplate?._id === template._id 
                    ? 'rgba(236, 72, 153, 0.1)' 
                    : 'var(--glass-bg)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  backdropFilter: 'blur(10px)'
                }}
                onMouseEnter={(e) => {
                  if (selectedTemplate?._id !== template._id) {
                    e.currentTarget.style.borderColor = 'var(--primary-light)';
                    e.currentTarget.style.transform = 'translateX(5px)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedTemplate?._id !== template._id) {
                    e.currentTarget.style.borderColor = 'var(--glass-border)';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--gray-900)' }}>
                    {template.title}
                  </h3>
                  {selectedTemplate?._id === template._id && (
                    <span style={{ color: 'var(--primary)', fontSize: '1.25rem' }}>✓</span>
                  )}
                </div>
                <p style={{ color: 'var(--gray-600)', fontSize: '0.875rem', lineHeight: '1.5' }}>
                  {template.content}
                </p>
                <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span className="badge">{template.category}</span>
                  {template.isSystem && <span className="badge">System</span>}
                </div>
              </div>
            ))}
          </div>
        )}

        <button 
          onClick={handleGenerate}
          disabled={!selectedTemplate || generating}
          className="btn btn-primary btn-block"
          style={{ marginTop: '1.5rem' }}
        >
          {generating ? (
            <>
              <div className="spinner" style={{ width: '20px', height: '20px', margin: 0 }}></div>
              Generating...
            </>
          ) : (
            <>✨ Generate Wish</>
          )}
        </button>
      </div>

      {/* Generated Wish */}
      {generatedWish && (
        <div className="card" style={{
          background: 'var(--glass-bg)',
          animation: 'slideDown 0.5s ease-out'
        }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>
            Your Personalized Wish 💌
          </h2>
          
          <div style={{
            padding: '1.5rem',
            background: 'rgba(255, 255, 255, 0.5)',
            borderRadius: '12px',
            marginBottom: '1rem',
            fontSize: '1.1rem',
            lineHeight: '1.8',
            color: 'var(--gray-900)',
            border: '2px dashed var(--primary-light)'
          }}>
            {generatedWish}
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              onClick={handleCopy}
              className="btn btn-primary"
              style={{ flex: 1 }}
            >
              {copied ? '✓ Copied!' : '📋 Copy Message'}
            </button>
            
            <button 
              onClick={() => {
                const phone = event.contactId?.phone;
                if (phone) {
                  const cleanPhone = phone.replace(/[\s\-()]/g, '');
                  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(generatedWish)}`;
                  window.open(whatsappUrl, '_blank');
                } else {
                  alert('No phone number found');
                }
              }}
              className="btn btn-primary"
              style={{ flex: 1, background: '#25D366' }}
            >
              📱 Send via WhatsApp
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WishGenerator;
