const express = require('express');
const cors = require('cors');
const app = express();
const jobsRoutes = require('./routes/jobs');
const userRoutes = require('./routes/user');

// Middleware
app.use(express.json());

// Enhanced CORS configuration
app.use(cors({
  origin: [
    'https://job-app-7u0y.onrender.com', // Your frontend
    'http://localhost:5173' // For local development
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
  credentials: true // If using cookies/auth
}));

// API status endpoint
app.get('/api', (req, res) => {
  res.json({
    status: 'API is working',
    endpoints: {
      jobs: '/api/jobs',
      users: '/api/user'
    }
  });
});

// Routes
app.use('/api/jobs', jobsRoutes);
app.use('/api/user', userRoutes);

// 404 Handler (must be after all routes)
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});