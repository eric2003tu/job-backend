const jobs = [];
const applications = [];

/**
 * Get all job listings
 */
exports.getAllJobs = (req, res) => {
  const { title, company, location } = req.query;
  let filteredJobs = jobs;

  if (title) filteredJobs = filteredJobs.filter(job => job.title.includes(title));
  if (company) filteredJobs = filteredJobs.filter(job => job.company.includes(company));
  if (location) filteredJobs = filteredJobs.filter(job => job.location.includes(location));

  res.json(filteredJobs);
};

/**
 * Get a specific job by ID
 */
exports.getJobById = (req, res) => {
  const job = jobs.find(job => job.id === req.params.id);
  if (!job) return res.status(404).json({ message: 'Job not found' });
  res.json(job);
};

/**
 * Create a new job listing
 */
exports.createJob = (req, res) => {
  const job = { id: `${jobs.length + 1}`, ...req.body };
  jobs.push(job);
  res.status(201).json({ message: 'Job posted successfully', job });
};

/**
 * Update an existing job listing
 */
exports.updateJob = (req, res) => {
  const job = jobs.find(job => job.id === req.params.id);
  if (!job) return res.status(404).json({ message: 'Job not found' });

  Object.assign(job, req.body);
  res.json({ message: 'Job updated successfully', job });
};

/**
 * Delete a job listing
 */
exports.deleteJob = (req, res) => {
  const index = jobs.findIndex(job => job.id === req.params.id);
  if (index === -1) return res.status(404).json({ message: 'Job not found' });

  jobs.splice(index, 1);
  res.json({ message: 'Job deleted successfully' });
};

/**
 * Submit a job application
 */
exports.submitApplication = (req, res) => {
  const { jobId, applicantName, applicantEmail, resume } = req.body;

  if (!jobId || !applicantName || !applicantEmail || !resume) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const application = { id: `${applications.length + 1}`, jobId, applicantName, applicantEmail, resume };
  applications.push(application);

  res.status(201).json({ message: 'Application submitted successfully', application });
};