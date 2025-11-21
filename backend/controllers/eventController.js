import Event from '../models/Event.js';
import Contact from '../models/Contact.js';
import { getDaysUntil, isToday } from '../utils/dateUtils.js';

/**
 * @route   GET /api/events
 * @desc    Get all events for logged-in user
 * @access  Private
 */
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find({ userId: req.user._id })
      .populate('contactId', 'name phone relation')
      .sort({ nextOccurrence: 1 });

    res.json({
      success: true,
      count: events.length,
      data: { events }
    });

  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch events' 
    });
  }
};

/**
 * @route   GET /api/events/today
 * @desc    Get today's events (THE DASHBOARD!)
 * @access  Private
 */
export const getTodayEvents = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const events = await Event.find({
      userId: req.user._id,
      nextOccurrence: { $gte: today, $lt: tomorrow }
    })
      .populate('contactId', 'name phone relation')
      .sort({ nextOccurrence: 1 });

    res.json({
      success: true,
      count: events.length,
      data: { events }
    });

  } catch (error) {
    console.error('Get today events error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch today events' 
    });
  }
};

/**
 * @route   GET /api/events/upcoming
 * @desc    Get upcoming events (next 30 days)
 * @access  Private
 */
export const getUpcomingEvents = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const next30Days = new Date(today);
    next30Days.setDate(next30Days.getDate() + 30);

    const events = await Event.find({
      userId: req.user._id,
      nextOccurrence: { $gte: today, $lt: next30Days }
    })
      .populate('contactId', 'name phone relation')
      .sort({ nextOccurrence: 1 });

    res.json({
      success: true,
      count: events.length,
      data: { events }
    });

  } catch (error) {
    console.error('Get upcoming events error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch upcoming events' 
    });
  }
};

/**
 * @route   POST /api/events
 * @desc    Create new event
 * @access  Private
 */
export const createEvent = async (req, res) => {
  try {
    const { contactId, title, type, originalDate, notes } = req.body;

    // Bug fix: Verify contact belongs to user
    const contact = await Contact.findOne({ _id: contactId, userId: req.user._id });
    if (!contact) {
      return res.status(404).json({ 
        success: false, 
        message: 'Contact not found' 
      });
    }

    const date = new Date(originalDate);
    
    const event = await Event.create({
      userId: req.user._id,
      contactId,
      title,
      type,
      originalDate: date,
      recurringMonth: date.getMonth() + 1,
      recurringDay: date.getDate(),
      notes
    });

    // Populate contact info for response
    await event.populate('contactId', 'name phone relation');

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: { event }
    });

  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create event' 
    });
  }
};

/**
 * @route   PUT /api/events/:id
 * @desc    Update event
 * @access  Private
 */
export const updateEvent = async (req, res) => {
  try {
    const { title, type, originalDate, notes } = req.body;

    const updateData = { title, type, notes, lastSynced: Date.now() };

    if (originalDate) {
      const date = new Date(originalDate);
      updateData.originalDate = date;
      updateData.recurringMonth = date.getMonth() + 1;
      updateData.recurringDay = date.getDate();
    }

    const event = await Event.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      updateData,
      { new: true, runValidators: true }
    ).populate('contactId', 'name phone relation');

    if (!event) {
      return res.status(404).json({ 
        success: false, 
        message: 'Event not found' 
      });
    }

    res.json({
      success: true,
      message: 'Event updated successfully',
      data: { event }
    });

  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update event' 
    });
  }
};

/**
 * @route   DELETE /api/events/:id
 * @desc    Delete event
 * @access  Private
 */
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user._id 
    });

    if (!event) {
      return res.status(404).json({ 
        success: false, 
        message: 'Event not found' 
      });
    }

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });

  } catch (error) {
    console.error('Delete event error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete event' 
    });
  }
};
