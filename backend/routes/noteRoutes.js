const express = require('express');
const router = express.Router();
const noteController = require('../controllers/noteController');

router.get('/', noteController.getNotes);
router.get('/:date', noteController.getNoteByDate);
router.post('/', noteController.saveNote);
router.delete('/:date', noteController.deleteNote);

module.exports = router;
