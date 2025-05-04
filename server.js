const express = require('express');
const cors = require('cors');
const app = express();
const jobsRoutes = require('./routes/jobs');
const userRoutes = require('./routes/user');

// Middleware
app.use(express.json());

// CORS configuration
app.use(cors({
  allowedHeaders: ['Content-Type'],
  origin: 'https://job-app-7u0y.onrender.com', // change if needed
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

// Routes
app.use('/api/jobs', jobsRoutes);
app.use('/api/user', userRoutes);

// Start server (IMPORTANT for Render)
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
