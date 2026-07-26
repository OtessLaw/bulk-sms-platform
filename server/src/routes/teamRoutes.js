const express = require('express');
const router = express.Router();
const { getTeamMembers, inviteTeamMember, deleteTeamMember } = require('../controllers/teamController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getTeamMembers);
router.post('/invite', inviteTeamMember);
router.delete('/:id', deleteTeamMember);

module.exports = router;
