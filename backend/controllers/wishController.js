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

    // Get event with contact details
    const event = await Event.findOne({ _id: eventId, userId: req.user._id })
      .populate('contactId');

    if (!event) {
      return res.status(404).json({ 
        success: false, 
        message: 'Event not found' 
      });
    }

    // Get template
    const template = await Template.findById(templateId);
    if (!template) {
      return res.status(404).json({ 
        success: false, 
        message: 'Template not found' 
      });
    }

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

    // Prepare data for template rendering
    const data = {
      name: event.contactId.name,
      age: age || '',
      relation: event.contactId.relation,
      year: year || '',
      eventType: event.type
    };

    // Render template with actual data
    const message = renderTemplate(template.content, data);

    res.json({
      success: true,
      data: { 
        message,
        contact: {
          name: event.contactId.name,
          phone: event.contactId.phone
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
      message: 'Failed to generate wish' 
    });
  }
};
