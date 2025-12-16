const express = require('express');
const { register, login } = require('../controllers/auth');

const router = express.Router();

// Register new user
router.post('/register', register);

// Login user
router.post('/login', login);

module.exports = router;
