const PDFDocument = require('pdfkit');
const { getDb } = require('../models/db');

// Función para generar un PDF con datos de equipos
const generateTeamsPDF = async (req, res) => {
  try {
    const db = getDb();
    const teams = await db.collection('team').find().toArray(); // Obtener equipos desde la base de datos

    if (teams.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No se encontraron equipos en la base de datos',
      });
    }

    // Crear un documento PDF
    const doc = new PDFDocument({ margin: 30 });
    const buffers = [];
    doc.on('data', (chunk) => buffers.push(chunk));
    doc.on('end', async () => {
      const pdfBuffer = Buffer.concat(buffers);

      // Guardar el PDF en la base de datos
      const pdfBase64 = pdfBuffer.toString('base64');
      await db.collection('PDFs').insertOne({
        name: `teams_${Date.now()}.pdf`,
        content: pdfBase64,
        createdAt: new Date(),
        type: 'teams',
      });

      res.status(201).json({
        success: true,
        message: 'PDF generado y almacenado exitosamente en la base de datos',
      });
    });

    // Agregar encabezado
    doc.fontSize(20).text('Reporte de Equipos', { align: 'center' });
    doc.moveDown();

    // Dibujar tabla
    const tableStartX = 50;
    const tableStartY = 100;
    const columnWidths = [100, 100, 100, 100, 100];
    const rowHeight = 20;

    doc.fontSize(10).text('Equipo', tableStartX, tableStartY, { width: columnWidths[0], align: 'center' });
    doc.text('Partidos Jugados', tableStartX + columnWidths[0], tableStartY, { width: columnWidths[1], align: 'center' });
    doc.text('Ganados', tableStartX + columnWidths[0] + columnWidths[1], tableStartY, { width: columnWidths[2], align: 'center' });
    doc.text('Puntos', tableStartX + columnWidths[0] + columnWidths[1] + columnWidths[2], tableStartY, { width: columnWidths[3], align: 'center' });
    doc.text('Posesión', tableStartX + columnWidths[0] + columnWidths[1] + columnWidths[2] + columnWidths[3], tableStartY, { width: columnWidths[4], align: 'center' });

    let currentY = tableStartY + rowHeight;

    teams.forEach((team) => {
      doc.text(team.team, tableStartX, currentY, { width: columnWidths[0], align: 'center' });
      doc.text(team.played.toString(), tableStartX + columnWidths[0], currentY, { width: columnWidths[1], align: 'center' });
      doc.text(team.won.toString(), tableStartX + columnWidths[0] + columnWidths[1], currentY, { width: columnWidths[2], align: 'center' });
      doc.text(team.points.toString(), tableStartX + columnWidths[0] + columnWidths[1] + columnWidths[2], currentY, { width: columnWidths[3], align: 'center' });
      doc.text(team.possession, tableStartX + columnWidths[0] + columnWidths[1] + columnWidths[2] + columnWidths[3], currentY, { width: columnWidths[4], align: 'center' });
      currentY += rowHeight;
    });

    doc.end();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al generar el PDF de equipos',
      error: error.message,
    });
  }
};


const getTeamsPDF = async (req, res) => {
    try {
      const db = getDb();
      const pdf = await db.collection('PDFs').findOne({ name: req.params.name });
  
      if (!pdf) {
        return res.status(404).json({
          success: false,
          message: 'PDF no encontrado',
        });
      }
  
      const pdfBuffer = Buffer.from(pdf.content, 'base64');
  
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=${pdf.name}`);
      res.send(pdfBuffer);
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener el PDF',
        error: error.message,
      });
    }
  };
  
  module.exports = {
    generateTeamsPDF,
    getTeamsPDF,
  };
  