// routes/auth.routes.js
const express = require('express');
const { login, register, refreshToken, protectedRoute, logout } = require('../controllers/auth.controller.js');
const { authenticateToken } = require('../middlewares/auth.middleware.js');

const router = express.Router();

router.post('/register', register);           // Register new user
router.post('/login', login);                 // Login user
router.post('/refresh', refreshToken);        // Get new access token
router.get('/protected', authenticateToken, protectedRoute); // Protected route


module.exports = router;
