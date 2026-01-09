const express = require('express');
const router = express.Router();
const settlementController = require('../controllers/settlement.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.use(verifyToken);

router.post('/', settlementController.recordSettlement);
router.get('/group/:groupId', settlementController.getGroupSettlements);

module.exports = router;
