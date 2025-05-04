const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Mock user database
const users = [
  { id: 1, name: 'John Doe', email: 'john@example.com' }
];

/**
 * @route   GET /api/user
 * @desc    Get authenticated user's profile
 * @access  Private
 */
router.get('/', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = users.find(user => user.id === decoded.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

module.exports = router;