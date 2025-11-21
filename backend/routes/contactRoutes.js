import express from 'express';
import {
  getContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact
} from '../controllers/contactController.js';
import { authenticate } from '../middleware/auth.js';
import { contactValidation } from '../utils/validators.js';
import { validationResult } from 'express-validator';

const router = express.Router();

// Validation middleware
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

// Bug fix: All contact routes require authentication
router.use(authenticate);

// Contact CRUD routes
router.get('/', getContacts);
router.get('/:id', getContact);
router.post('/', contactValidation, validate, createContact);
router.put('/:id', contactValidation, validate, updateContact);
router.delete('/:id', deleteContact);

export default router;
