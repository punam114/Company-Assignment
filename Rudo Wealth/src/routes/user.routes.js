const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.use(verifyToken);

router.get('/profile', userController.getProfile);
router.get('/balances', userController.getBalances);

module.exports = router;
