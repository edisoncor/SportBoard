const { getDb } = require('../models/db');

const TestEndPoint = async (req,res) =>{
  res.json({
    message: "Hola Mundo",
    status: "OK"
  });
}

const getTeams = async (req, res) => {
  try {
    const db = getDb();
    const teams = await db.collection('team').find().toArray();
    res.json({
      success: true,
      data: teams
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener los equipos',
      error: error.message
    });
  }
};

const getMatches = async (req, res) => {
  try {
    const db = getDb();
    const matches = await db.collection('match').find().toArray();
    res.json({
      success: true,
      data: matches
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener los partidos',
      error: error.message
    });
  }
};


const getCompetition = async (req, res) => {
  try {
    const db = getDb();
    const competition = await db.collection('competition').findOne();
    res.json({
      success: true,
      data: competition
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener los datos de la competición',
      error: error.message
    });
  }
};

// Obtener partidos próximos
const getUpcomingMatches = async (req, res) => {
  try {
    const db = getDb();
    const upcomingMatches = await db.collection('upcomingMatch').find().toArray();
    res.json({
      success: true,
      data: upcomingMatches
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener los partidos próximos',
      error: error.message
    });
  }
};

// Obtener tabla de posiciones
const getLeaderboard = async (req, res) => {
  try {
    const db = getDb();
    const leaderboards = await db.collection('leaderboard').find().toArray();
    res.json({
      success: true,
      data: leaderboards
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener la tabla de posiciones',
      error: error.message
    });
  }
};

// Obtener estadísticas de jugadores
const getPlayers = async (req, res) => {
  try {
    const db = getDb();
    const players = await db.collection('player').find().toArray();
    res.json({
      success: true,
      data: players
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener los jugadores',
      error: error.message
    });
  }
};



module.exports = {
  getTeams,
  getMatches,
  getCompetition,
  getUpcomingMatches,
  getLeaderboard,
  getPlayers,
  TestEndPoint,
};
