const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');

// Path to jobs data file
const dataPath = path.join(__dirname, '../data/jobs.json');

// Create directory if it doesn't exist
const ensureDataDirExists = async () => {
  const dir = path.dirname(dataPath);
  try {
    await fs.access(dir);
  } catch (error) {
    await fs.mkdir(dir, { recursive: true });
  }
};

// Load jobs data
const loadJobs = async () => {
  try {
    await ensureDataDirExists();
    const data = await fs.readFile(dataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist or is empty, return empty array
    return [];
  }
};

// Save jobs data
const saveJobs = async (jobs) => {
  await ensureDataDirExists();
  await fs.writeFile(dataPath, JSON.stringify(jobs, null, 2));
};

// Get all jobs with optional filtering
exports.getAllJobs = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        status: 'error', 
        errors: errors.array() 
      });
    }

    const { title, company, location, page = 1, limit = 10 } = req.query;
    let jobs = await loadJobs();

    // Apply filters if provided
    if (title) {
      jobs = jobs.filter(job => job.title.toLowerCase().includes(title.toLowerCase()));
    }
    if (company) {
      jobs = jobs.filter(job => job.company.toLowerCase().includes(company.toLowerCase()));
    }
    if (location) {
      jobs = jobs.filter(job => job.location.toLowerCase().includes(location.toLowerCase()));
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = jobs.length;
    const paginatedJobs = jobs.slice(startIndex, endIndex);

    res.json({
      status: 'success',
      results: paginatedJobs.length,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        limit: parseInt(limit)
      },
      data: paginatedJobs
    });
  } catch (error) {
    console.error('Error getting jobs:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve jobs'
    });
  }
};

// Get job by ID
exports.getJobById = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        status: 'error', 
        errors: errors.array() 
      });
    }

    const { id } = req.params;
    const jobs = await loadJobs();
    const job = jobs.find(job => job.id === id);

    if (!job) {
      return res.status(404).json({
        status: 'error',
        message: 'Job not found'
      });
    }

    res.json({
      status: 'success',
      data: job
    });
  } catch (error) {
    console.error('Error getting job:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve job'
    });
  }
};

// Create a new job
exports.createJob = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        status: 'error', 
        errors: errors.array() 
      });
    }

    const { 
      title, 
      company, 
      location, 
      description, 
      applicationMethod,
      salary,
      jobType,
      category
    } = req.body;

    const newJob = {
      id: uuidv4(),
      title,
      company,
      location,
      description,
      applicationMethod,
      salary: salary || 'Not specified',
      jobType: jobType || 'Full-time',
      category: category || 'General',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const jobs = await loadJobs();
    jobs.push(newJob);
    await saveJobs(jobs);

    res.status(201).json({
      status: 'success',
      data: newJob
    });
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to create job'
    });
  }
};

// Update an existing job
exports.updateJob = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        status: 'error', 
        errors: errors.array() 
      });
    }

    const { id } = req.params;
    const jobs = await loadJobs();
    const jobIndex = jobs.findIndex(job => job.id === id);

    if (jobIndex === -1) {
      return res.status(404).json({
        status: 'error',
        message: 'Job not found'
      });
    }

    // Update job with new data while preserving existing data
    const updatedJob = {
      ...jobs[jobIndex],
      ...req.body,
      updatedAt: new Date().toISOString()
    };

    jobs[jobIndex] = updatedJob;
    await saveJobs(jobs);

    res.json({
      status: 'success',
      data: updatedJob
    });
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update job'
    });
  }
};

// Delete a job
exports.deleteJob = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        status: 'error', 
        errors: errors.array() 
      });
    }

    const { id } = req.params;
    const jobs = await loadJobs();
    const jobIndex = jobs.findIndex(job => job.id === id);

    if (jobIndex === -1) {
      return res.status(404).json({
        status: 'error',
        message: 'Job not found'
      });
    }

    jobs.splice(jobIndex, 1);
    await saveJobs(jobs);

    res.json({
      status: 'success',
      message: 'Job deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to delete job'
    });
  }
};