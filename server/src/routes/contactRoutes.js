const express = require('express');
const router = express.Router();
const {
  getContacts,
  createContact,
  createBulkContacts,
  deleteContact,
  createGroup,
  deleteGroup,
} = require('../controllers/contactController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getContacts);
router.post('/', createContact);
router.post('/bulk', createBulkContacts);
router.delete('/:id', deleteContact);

router.post('/groups', createGroup);
router.delete('/groups/:id', deleteGroup);

module.exports = router;
