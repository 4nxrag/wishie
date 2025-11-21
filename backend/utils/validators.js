import { body } from 'express-validator';

/**
 * Validation rules for user registration
 * Prevents: XSS, injection, malformed data
 */
export const registerValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters')
    .escape(), // Bug fix: Prevent XSS attacks
  
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(), // Bug fix: Convert to lowercase, remove dots from Gmail
  
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain uppercase, lowercase, and number')
];

/**
 * Validation rules for login
 */
export const loginValidation = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  
  body('password')
    .notEmpty().withMessage('Password is required')
];

/**
 * Validation rules for contact creation
 */
export const contactValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ max: 100 }).withMessage('Name too long')
    .escape(),
  
  body('phone')
    .trim()
    .notEmpty().withMessage('Phone number is required')
    .matches(/^\+?[\d\s\-()]+$/).withMessage('Invalid phone format'),
  
  body('relation')
    .optional()
    .isIn(['girlfriend', 'boyfriend', 'friend', 'family', 'colleague', 'other'])
    .withMessage('Invalid relation type')
];

/**
 * Validation rules for event creation
 */
export const eventValidation = [
  body('contactId')
    .notEmpty().withMessage('Contact ID is required')
    .isMongoId().withMessage('Invalid contact ID'),
  
  body('title')
    .trim()
    .notEmpty().withMessage('Event title is required')
    .isLength({ max: 100 }).withMessage('Title too long')
    .escape(),
  
  body('type')
    .notEmpty().withMessage('Event type is required')
    .isIn(['birthday', 'anniversary', 'pet_birthday', 'other'])
    .withMessage('Invalid event type'),
  
  body('originalDate')
    .notEmpty().withMessage('Event date is required')
    .isISO8601().withMessage('Invalid date format')
];
