const express = require('express');
const router = express.Router();
const dataController = require('../controllers/datacontroller');
const { generateTeamsPDF } = require('../controllers/pdfController');
const { getTeamsPDF } = require('../controllers/pdfController');

router.get('/teams', dataController.getTeams);
router.get('/matches', dataController.getMatches);
router.get('/competition', dataController.getCompetition);
router.get('/upcomingMatches', dataController.getUpcomingMatches);
router.get('/leaderboards', dataController.getLeaderboard);
router.get('/players', dataController.getPlayers);

router.get('/test', dataController.TestEndPoint);

router.post('/generate-teams-pdf', generateTeamsPDF);
router.get('/download-pdf/:name', getTeamsPDF);

module.exports = router;
