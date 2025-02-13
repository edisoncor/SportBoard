// pdfDownloadController.js
const { getDb } = require('../models/db');

const getRecentPDFs = async (req, res) => {
  try {
    const db = getDb();
    const { type } = req.params;
    const { timestamp } = req.query;

    if (!type) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere el parámetro type',
      });
    }

    const validTypes = ['teams', 'matches', 'players', 'leaderboard'];
    if (!validTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Tipo de PDF no válido. Los tipos válidos son: teams, matches, players, leaderboard',
      });
    }

    let query = { type: type };
    if (timestamp) {
      query.createdAt = { $gte: new Date(timestamp) };
    }

    const recentPDFs = await db.collection('PDFs')
      .find(query)
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();

    if (recentPDFs.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No se encontraron PDFs recientes de tipo ${type}`,
      });
    }

    if (recentPDFs.length > 1) {
      return res.status(200).json({
        success: true,
        message: 'Múltiples PDFs recientes encontrados',
        pdfs: recentPDFs.map(pdf => ({
          name: pdf.name,
          createdAt: pdf.createdAt
        }))
      });
    }

    const pdf = recentPDFs[0];
    const pdfBuffer = Buffer.from(pdf.content, 'base64');

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${pdf.name}`);
    res.send(pdfBuffer);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al buscar y obtener el PDF',
      error: error.message,
    });
  }
};

module.exports = {
  getRecentPDFs
};