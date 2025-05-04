# Job Board API

A RESTful API backend for a job board application built with Node.js and Express.

## Technologies Used

- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **UUID** - For generating unique IDs
- **Express Validator** - For input validation
- **Morgan** - HTTP request logger
- **Dotenv** - Environment variable management
- **Cors** - Cross-Origin Resource Sharing

## Project Structure

```
├── server.js           # Application entry point
├── controllers/        # Route controllers
│   └── jobs.js         # Job CRUD operations
├── routes/             # Route definitions
│   └── jobs.js         # Job routes
├── middleware/         # Custom middleware
│   └── errorHandler.js # Error handling middleware
├── utils/              # Utility functions
│   └── AppError.js     # Custom error class
├── data/               # Data storage
│   └── jobs.json       # JSON file for job storage
├── .env                # Environment variables
└── package.json        # Project dependencies
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /api/jobs | Get all jobs with optional filtering |
| GET    | /api/jobs/:id | Get a specific job by ID |
| POST   | /api/jobs | Create a new job listing |
| PUT    | /api/jobs/:id | Update an existing job |
| DELETE | /api/jobs/:id | Delete a job listing |

## Job Object Structure

```json
{
  "id": "unique-uuid",
  "title": "Job Title",
  "company": "Company Name",
  "location": "Job Location",
  "description": "Detailed job description",
  "applicationMethod": {
    "type": "email|link",
    "value": "email@example.com OR https://apply.example.com"
  },
  "salary": "Salary range or description",
  "jobType": "Full-time|Part-time|Contract|Internship",
  "category": "Job category",
  "createdAt": "ISO date string",
  "updatedAt": "ISO date string"
}
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Copy the sample jobs file:
   ```
   mkdir -p data && cp data/jobs.sample.json data/jobs.json
   ```
4. Start the development server:
   ```
   npm run dev
   ```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
PORT=3000
NODE_ENV=development
```

## Request Examples

### Get all jobs
```
GET /api/jobs
```

### Get jobs with filters
```
GET /api/jobs?title=developer&location=Kigali&page=1&limit=10
```

### Get job by ID
```
GET /api/jobs/1
```

### Create a new job
```
POST /api/jobs
Content-Type: application/json

{
  "title": "Frontend Developer",
  "company": "Tech Company",
  "location": "Kigali, Rwanda",
  "description": "Detailed job description here",
  "applicationMethod": {
    "type": "email",
    "value": "careers@example.com"
  },
  "salary": "$1,000 - $2,000 per month",
  "jobType": "Full-time",
  "category": "Software Development"
}
```

### Update a job
```
PUT /api/jobs/1
Content-Type: application/json

{
  "title": "Senior Frontend Developer",
  "salary": "$2,000 - $3,000 per month"
}
```

### Delete a job
```
DELETE /api/jobs/1
```