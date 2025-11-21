import express from 'express';
import {
  getEvents,
  getTodayEvents,
  getUpcomingEvents,
  createEvent,
  updateEvent,
  deleteEvent
} from '../controllers/eventController.js';
import { authenticate } from '../middleware/auth.js';
import { eventValidation } from '../utils/validators.js';
import { validationResult } from 'express-validator';

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

router.get('/', getEvents);
router.get('/today', getTodayEvents);  // Important: Must be BEFORE /:id
router.get('/upcoming', getUpcomingEvents);
router.post('/', eventValidation, validate, createEvent);
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent);

export default router;
