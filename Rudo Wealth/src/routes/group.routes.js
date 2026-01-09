const express = require('express');
const router = express.Router();
const groupController = require('../controllers/group.controller');
const { verifyToken } = require('../middleware/auth.middleware');

router.use(verifyToken);

router.post('/', groupController.createGroup);
router.get('/', groupController.getMyGroups);
router.get('/:groupId', groupController.getGroupDetails);
router.post('/:groupId/members', groupController.addMember);
router.delete('/:groupId/members/:userId', groupController.removeMember);

module.exports = router;
