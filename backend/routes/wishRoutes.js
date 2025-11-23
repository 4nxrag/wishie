import express from 'express';
import { generateWish } from '../controllers/wishController.js';
import { authenticate } from '../middleware/auth.js';
import { body, validationResult } from 'express-validator';

const router = express.Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false, 
      errors: errors.array().map(e => ({ field: e.path, message: e.msg }))
    });
  }
  next();
};

// All routes require authentication
router.use(authenticate);

// Generate wish from template
router.post('/generate', [
  body('eventId').notEmpty().withMessage('Event ID is required').isMongoId(),
  body('templateId').notEmpty().withMessage('Template ID is required').isMongoId()
], validate, generateWish);

export default router;
