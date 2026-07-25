const express = require('express');
const router = express.Router();
const { getContacts, createContact, deleteContact } = require('../controllers/contactController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/', getContacts);
router.post('/', createContact);
router.delete('/:id', deleteContact);

module.exports = router;
