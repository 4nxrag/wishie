import { renderTemplate } from '../services/templateService.js';
import Template from '../models/Template.js';
import Event from '../models/Event.js';
import { calculateAge } from '../utils/dateUtils.js';

/**
 * @route   POST /api/wishes/generate
 * @desc    Generate personalized wish from template
 * @access  Private
 */

export const generateWish = async (req, res) => {
  try {
    const { eventId, templateId } = req.body;

    console.log('Generating wish for:', { eventId, templateId, userId: req.user._id });

    // Get event with contact details (POPULATE contactId!)
    const event = await Event.findOne({ _id: eventId, userId: req.user._id })
      .populate('contactId');

    if (!event) {
      return res.status(404).json({ 
        success: false, 
        message: 'Event not found' 
      });
    }

    console.log('Event found:', event.title);
    console.log('Contact:', event.contactId); // Debug: Check if contact populated

    // Get template
    const template = await Template.findById(templateId);
    if (!template) {
      return res.status(404).json({ 
        success: false, 
        message: 'Template not found' 
      });
    }

    console.log('Template found:', template.title);
    console.log('Template content:', template.content); // Debug

    // Calculate age (for birthdays)
    let age = null;
    if (event.type === 'birthday' || event.type === 'pet_birthday') {
      age = calculateAge(event.originalDate);
    }

    // Calculate years (for anniversaries)
    let year = null;
    if (event.type === 'anniversary') {
      year = calculateAge(event.originalDate);
    }

    console.log('Calculated age/year:', { age, year }); // Debug

    // Prepare data for template rendering
    const data = {
      name: event.contactId?.name || '',
      age: age || '',
      relation: event.contactId?.relation || '',
      year: year || '',
      eventType: event.type
    };

    console.log('Data for rendering:', data); // Debug

    // Render template with actual data
    const message = renderTemplate(template.content, data);

    console.log('Generated message:', message); // Debug

    res.json({
      success: true,
      data: { 
        message,
        contact: {
          name: event.contactId?.name,
          phone: event.contactId?.phone
        },
        event: {
          id: event._id,
          title: event.title,
          type: event.type
        },
        template: {
          title: template.title,
          category: template.category
        }
      }
    });

  } catch (error) {
    console.error('Generate wish error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to generate wish',
      error: error.message
    });
  }
};
