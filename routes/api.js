const express = require('express');
const teraboxController = require('../controllers/teraboxController');

const router = express.Router();

// Process terabox link to get direct URL
router.post('/process-link', teraboxController.processLink);

module.exports = router;
