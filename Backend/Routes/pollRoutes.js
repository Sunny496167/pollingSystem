const express = require('express');
const router = express.Router();
const pollController = require('../Controller/pollController');

// Define routes and link to controller functions
router.get('/status', pollController.getStatus);
router.get('/results', pollController.getResults);
router.get('/stats', pollController.getStats);
router.post('/create', pollController.createPoll);
router.delete('/close', pollController.closePoll);
router.get('/active', pollController.getActivePoll);
router.post('/answer', pollController.submitAnswer);

module.exports = router;
