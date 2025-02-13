const express = require("express");
const router = express.Router();
const dataController = require("../controllers/datacontroller");
const { getRecentPDFs } = require("../controllers/pdfdownloadController");
const { generateTeamsPDF } = require("../controllers/pdfTeamsController");
const { generateMatchesPDF } = require("../controllers/pdfMatchesController");
const { generatePlayersPDF } = require("../controllers/pdfPlayersController");
const { generateLeaderboardPDF } = require("../controllers/pdfLeaderboardController");


router.get("/teams", dataController.getTeams);
router.get("/matches", dataController.getMatches);
router.get("/competition", dataController.getCompetition);
router.get("/upcomingMatches", dataController.getUpcomingMatches);
router.get("/leaderboards", dataController.getLeaderboard);
router.get("/players", dataController.getPlayers);

// Rutas para generar PDFs
router.post("/generate-teams-pdf", generateTeamsPDF);
router.post("/generate-matches-pdf", generateMatchesPDF);
router.post("/generate-players-pdf", generatePlayersPDF);
router.post("/generate-leaderboard-pdf", generateLeaderboardPDF);

// Nueva ruta para obtener PDFs recientes
router.get("/get-recent-pdfs/:type", getRecentPDFs);

module.exports = router;