const express = require('express');
const { signupUser, loginUser } = require('../controllers/authController');

const router = express.Router();

// Route: POST /api/auth/signup
router.post('/signup', signupUser);

// Route: POST /api/auth/login
router.post('/login', loginUser);

module.exports = router;
