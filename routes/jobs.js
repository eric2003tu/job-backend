const express = require('express');
const router = express.Router();
const { body, param, query } = require('express-validator');
const jobsController = require('../controllers/jobsControllers');

/**
 * @route   GET /api/jobs
 * @desc    Get all job listings with optional filtering
 * @access  Public
 */
router.get('/', [
  query('title').optional().isString().trim(),
  query('company').optional().isString().trim(),
  query('location').optional().isString().trim(),
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 50 }).toInt()
], jobsController.getAllJobs);

/**
 * @route   GET /api/jobs/:id
 * @desc    Get a specific job by ID
 * @access  Public
 */
router.get('/:id', [
  param('id').isString().trim().notEmpty()
], jobsController.getJobById);

/**
 * @route   POST /api/jobs
 * @desc    Create a new job listing
 * @access  Public (would be protected in production)
 */
router.post('/', [
  body('title').isString().trim().notEmpty().withMessage('Job title is required'),
  body('company').isString().trim().notEmpty().withMessage('Company name is required'),
  body('location').isString().trim().notEmpty().withMessage('Location is required'),
  body('description').isString().trim().notEmpty().withMessage('Job description is required'),
  body('applicationMethod').isObject().withMessage('Application method is required'),
  body('applicationMethod.type').isString().isIn(['email', 'link']).withMessage('Application method must be email or link'),
  body('applicationMethod.value').isString().trim().notEmpty().withMessage('Application method value is required'),
  body('salary').optional().isString().trim(),
  body('jobType').optional().isString().trim(),
  body('category').optional().isString().trim(),
  body('requirements').optional().isArray().withMessage('Requirements must be an array'),
  body('responsibilities').optional().isArray().withMessage('Responsibilities must be an array')
], jobsController.createJob);

/**
 * @route   PUT /api/jobs/:id
 * @desc    Update an existing job listing
 * @access  Public (would be protected in production)
 */
router.put('/:id', [
  param('id').isString().trim().notEmpty(),
  body('title').optional().isString().trim().notEmpty(),
  body('company').optional().isString().trim().notEmpty(),
  body('location').optional().isString().trim().notEmpty(),
  body('description').optional().isString().trim().notEmpty(),
  body('applicationMethod').optional().isObject(),
  body('applicationMethod.type').optional().isString().isIn(['email', 'link']),
  body('applicationMethod.value').optional().isString().trim().notEmpty(),
  body('salary').optional().isString().trim(),
  body('jobType').optional().isString().trim(),
  body('category').optional().isString().trim(),
  body('requirements').optional().isArray(),
  body('responsibilities').optional().isArray()
], jobsController.updateJob);

/**
 * @route   DELETE /api/jobs/:id
 * @desc    Delete a job listing
 * @access  Public (would be protected in production)
 */
router.delete('/:id', [
  param('id').isString().trim().notEmpty()
], jobsController.deleteJob);

/**
 * @route   POST /api/applications
 * @desc    Submit a job application
 * @access  Public
 */
router.post('/applications', [
  body('jobId').isString().trim().notEmpty().withMessage('Job ID is required'),
  body('applicantName').isString().trim().notEmpty().withMessage('Applicant name is required'),
  body('applicantEmail').isEmail().withMessage('Valid email is required'),
  body('resume').isString().trim().notEmpty().withMessage('Resume is required')
], jobsController.submitApplication);

module.exports = router;