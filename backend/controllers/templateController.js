import Template from '../models/Template.js';

/**
 * @route   GET /api/templates
 * @desc    Get all templates (system + user's custom)
 * @access  Private
 */
export const getTemplates = async (req, res) => {
  try {
    const { category, eventType } = req.query;

    // Bug fix: Show system templates + user's own templates
    const query = {
      $or: [
        { isSystem: true },
        { userId: req.user._id }
      ]
    };

    if (category) query['category'] = category;
    if (eventType) query['eventType'] = { $in: [eventType, 'all'] };

    const templates = await Template.find(query)
      .sort({ isSystem: -1, createdAt: -1 }); // System first, then newest

    res.json({
      success: true,
      count: templates.length,
      data: { templates }
    });

  } catch (error) {
    console.error('Get templates error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch templates' 
    });
  }
};

/**
 * @route   POST /api/templates
 * @desc    Create custom template
 * @access  Private
 */
export const createTemplate = async (req, res) => {
  try {
    const { title, content, category, eventType, variables } = req.body;

    const template = await Template.create({
      title,
      content,
      category,
      eventType,
      variables,
      userId: req.user._id,
      isSystem: false
    });

    res.status(201).json({
      success: true,
      message: 'Template created successfully',
      data: { template }
    });

  } catch (error) {
    console.error('Create template error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create template' 
    });
  }
};

/**
 * @route   DELETE /api/templates/:id
 * @desc    Delete custom template (only user's own, not system)
 * @access  Private
 */
export const deleteTemplate = async (req, res) => {
  try {
    // Bug fix: Only allow deleting user's own templates, not system ones
    const template = await Template.findOne({ 
      _id: req.params.id, 
      userId: req.user._id,
      isSystem: false 
    });

    if (!template) {
      return res.status(404).json({ 
        success: false, 
        message: 'Template not found or cannot be deleted' 
      });
    }

    await template.deleteOne();

    res.json({
      success: true,
      message: 'Template deleted successfully'
    });

  } catch (error) {
    console.error('Delete template error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to delete template' 
    });
  }
};
