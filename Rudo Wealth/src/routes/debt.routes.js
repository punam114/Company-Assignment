const express = require('express');
const router = express.Router();
const debtController = require('../controllers/debt.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.use(verifyToken);

router.get('/group/:groupId', debtController.getSimplifiedDebts);
router.get('/global', debtController.getGlobalSimplifiedDebts);

module.exports = router;
