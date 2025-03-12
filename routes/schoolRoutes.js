const express = require('express');
const schoolController = require('../controllers/schoolController');

const router = express.Router();

// Add a new school
router.post('/addSchool', schoolController.addSchool);

// List all schools sorted by proximity to user location
router.get('/listSchools', schoolController.listSchools);

module.exports = router;