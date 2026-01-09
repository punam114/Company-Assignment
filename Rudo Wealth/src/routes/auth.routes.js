const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// Both routes need the Firebase token to verify identity
router.post('/signup', verifyToken, authController.signup);
router.post('/login', verifyToken, authController.login);

module.exports = router;
