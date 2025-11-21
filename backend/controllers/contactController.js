import Contact from '../models/Contact.js';
import Event from '../models/Event.js'; 

/**
 * @route   GET /api/contacts
 * @desc    Get all contacts for logged-in user
 * @access  Private
 */
export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find({ userId: req.user._id })
      .sort({ createdAt: -1 }); // Bug fix: Newest first

    res.json({
      success: true,
      count: contacts.length,
      data: { contacts }
    });

  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch contacts' 
    });
  }
};

/**
 * @route   GET /api/contacts/:id
 * @desc    Get single contact with associated events
 * @access  Private
 */
export const getContact = async (req, res) => {
  try {
    // Bug fix: Verify contact belongs to user
    const contact = await Contact.findOne({ 
      _id: req.params.id, 
      userId: req.user._id 
    });

    if (!contact) {
      return res.status(404).json({ 
        success: false, 
        message: 'Contact not found' 
      });
    }

  
   const events = await Event.find({ contactId: contact._id })
    .sort({ nextOccurrence: 1 });

    res.json({
      success: true,
      data: { 
        contact,
        Event  
      }
    });

  } catch (error) {
    console.error('Get contact error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch contact' 
    });
  }
};

/**
 * @route   POST /api/contacts
 * @desc    Create new contact
 * @access  Private
 */
export const createContact = async (req, res) => {
  try {
    const { name, phone, relation, notes } = req.body;

    // Bug fix: Auto-assign userId from authenticated user
    const contact = await Contact.create({
      userId: req.user._id,
      name,
      phone,
      relation,
      notes
    });

    res.status(201).json({
      success: true,
      message: 'Contact created successfully',
      data: { contact }
    });

  } catch (error) {
    // Bug fix: Handle duplicate phone error gracefully
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'You already have a contact with this phone number'
      });
    }

    console.error('Create contact error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create contact' 
    });
  }
};

/**
 * @route   PUT /api/contacts/:id
 * @desc    Update contact
 * @access  Private
 */
export const updateContact = async (req, res) => {
  try {
    const { name, phone, relation, notes } = req.body;

    // Bug fix: Only update if belongs to user
    const contact = await Contact.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { name, phone, relation, notes, lastSynced: Date.now() },
      { new: true, runValidators: true } // Bug fix: Run validators on update
    );

    if (!contact) {
      return res.status(404).json({ 
        success: false, 
        message: 'Contact not found' 
      });
    }

    res.json({
      success: true,
      message: 'Contact updated successfully',
      data: { contact }
    });

  } catch (error) {
    console.error('Update contact error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update contact' 
    });
  }
};

/**
 * @route   DELETE /api/contacts/:id
 * @desc    Delete contact and associated events
 * @access  Private
 */
export const deleteContact = async (req, res) => {
  try {
    // Bug fix: Verify ownership before delete
    const contact = await Contact.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user._id 
    });

    if (!contact) {
      return res.status(404).json({ 
        success: false, 
        message: 'Contact not found' 
      });
    }

    // Bug fix: Cascade delete - remove all events for this contact
 await Event.deleteMany({ contactId: contact._id }); 

    res.json({
      success: true,
      message: 'Contact deleted successfully'
    });

  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete contact' 
    });
  }
};
