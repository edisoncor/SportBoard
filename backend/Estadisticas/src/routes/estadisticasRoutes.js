const express = require("express");
const router = express.Router();
const dataController = require("../controllers/datacontroller");
const { generateTeamsPDF, getTeamsPDF } = require("../controllers/pdfTeamsController");
const { generateMatchesPDF, getMatchesPDF } = require("../controllers/pdfMatchesController");
const { generatePlayersPDF, getPlayersPDF } = require("../controllers/pdfPlayersController");
const { generateLeaderboardPDF, getLeaderboardPDF } = require("../controllers/pdfLeaderboardController");


router.get("/teams", dataController.getTeams);
router.get("/matches", dataController.getMatches);
router.get("/competition", dataController.getCompetition);
router.get("/upcomingMatches", dataController.getUpcomingMatches);
router.get("/leaderboards", dataController.getLeaderboard);
router.get("/players", dataController.getPlayers);

// Rutas para PDF de equipos
router.post("/generate-teams-pdf", generateTeamsPDF);
router.get("/download-teams-pdf/:name", getTeamsPDF);

// Rutas para PDF de partidos
router.post("/generate-matches-pdf", generateMatchesPDF);
router.get("/download-matches-pdf/:name", getMatchesPDF);

// Rutas para PDF de jugadores
router.post("/generate-players-pdf", generatePlayersPDF);
router.get("/download-players-pdf/:name", getPlayersPDF);

// Rutas para PDF de tabla de posiciones
router.post("/generate-leaderboard-pdf", generateLeaderboardPDF);
router.get("/download-leaderboard-pdf/:name", getLeaderboardPDF);

module.exports = router;