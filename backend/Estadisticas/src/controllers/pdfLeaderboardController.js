const PDFDocument = require('pdfkit');
const { getDb } = require('../models/db');
const path = require('path');

const generateLeaderboardPDF = async (req, res) => {
  try {
    const db = getDb();
    const leaderboard = await db.collection('leaderboard').find().toArray();

    if (leaderboard.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No se encontraron datos de la tabla de posiciones en la base de datos',
      });
    }

    // Configuración inicial del documento
    const doc = new PDFDocument({
      margin: 50,
      size: 'A4',
      autoFirstPage: false
    });

    const buffers = [];
    doc.on('data', (chunk) => buffers.push(chunk));
    doc.on('end', async () => {
      const pdfBuffer = Buffer.concat(buffers);
      const pdfBase64 = pdfBuffer.toString('base64');
      await db.collection('PDFs').insertOne({
        name: `leaderboard_${Date.now()}.pdf`,
        content: pdfBase64,
        createdAt: new Date(),
        type: 'leaderboard',
      });

      res.status(201).json({
        success: true,
        message: 'PDF de la tabla de posiciones generado y almacenado exitosamente en la base de datos',
      });
    });

    // Colores
    const colors = {
      green: '#006838',
      red: '#ED1C24',
      gold: '#FDB913',
      blue: '#0077BE',
      purple: '#8E44AD',
      orange: '#F39C12',
      teal: '#16A085'
    };

    // Función para dibujar el marco
    const drawFrame = () => {
      const margin = 40;
      const width = doc.page.width - (margin * 2);
      const height = doc.page.height - (margin * 2);

      doc.save()
         .lineWidth(2)
         .strokeColor(colors.green)
         .rect(margin, margin, width, height)
         .stroke();

      doc.save()
         .lineWidth(2)
         .strokeColor(colors.red)
         .rect(margin + 5, margin + 5, width - 10, height - 10)
         .stroke();
    };

    // Función para dibujar el header
    const drawHeader = () => {
      const margin = 40;
      const logoSize = 60;
      
      const logoPath = path.join(__dirname, '../assets/Universidad-Nacional-de-Loja-UNL.png');
      doc.image(logoPath, margin + 10, margin + 10, { 
        width: logoSize,
        height: logoSize
      });

      doc.save()
         .lineWidth(3)
         .strokeColor(colors.red)
         .moveTo(margin + logoSize + 20, margin + 20)
         .lineTo(doc.page.width - margin - 20, margin + 20)
         .stroke();

      doc.save()
         .lineWidth(3)
         .strokeColor(colors.green)
         .moveTo(margin + logoSize + 20, margin + 30)
         .lineTo(doc.page.width - margin - 40, margin + 30)
         .stroke();

      doc.font('Helvetica-Bold')
         .fontSize(16)
         .text('UNIVERSIDAD NACIONAL DE LOJA', margin + logoSize + 20, margin + 40);

      doc.font('Helvetica')
         .fontSize(14)
         .text('Tabla de Posiciones', margin + logoSize + 20, margin + 60);

      doc.moveDown(3);
    };

    // Función para dibujar el footer
    const drawFooter = (pageNumber) => {
      const margin = 40;
      const y = doc.page.height - margin - 20;

      doc.save()
         .lineWidth(3)
         .strokeColor(colors.green)
         .moveTo(margin + 20, y)
         .lineTo(doc.page.width - margin - 20, y)
         .stroke();

      doc.save()
         .lineWidth(3)
         .strokeColor(colors.red)
         .moveTo(margin + 20, y + 8)
         .lineTo(doc.page.width - margin - 40, y + 8)
         .stroke();

      doc.fontSize(8)
         .fillColor('#666666')
         .text(
           `${pageNumber}`,
           margin,
           y + 12,
           { align: 'right', width: doc.page.width - (margin * 2) }
         );
    };

    // Función para dibujar gráfico de barras
    const drawBarChart = (data, startX, startY, width, height, title) => {
      const margin = { top: 40, right: 20, bottom: 100, left: 40 };
      const chartWidth = width - margin.left - margin.right;
      const chartHeight = height - margin.top - margin.bottom;
      const barWidth = (chartWidth / data.length) * 0.8;

      doc.font('Helvetica-Bold')
         .fontSize(16)
         .text(title, startX, startY, { align: 'center', width });

      const maxValue = Math.max(...data.map(d => d.value));

      data.forEach((d, i) => {
        const barHeight = (d.value / maxValue) * chartHeight;
        const x = startX + margin.left + (i * (chartWidth / data.length)) + ((chartWidth / data.length - barWidth) / 2);
        const y = startY + margin.top + chartHeight - barHeight;

        doc.rect(x, y, barWidth, barHeight)
           .fill(colors[Object.keys(colors)[i % Object.keys(colors).length]]);

        doc.font('Helvetica-Bold')
           .fontSize(12)
           .fillColor('#000000')
           .text(d.value.toString(), x, y - 20, { 
             width: barWidth, 
             align: 'center' 
           });

        doc.font('Helvetica')
           .fontSize(10)
           .text(d.label, x - 10, startY + height - margin.bottom + 10, { 
             width: barWidth + 20, 
             align: 'center' 
           });
      });
    };

    // Función para calcular estadísticas adicionales
    const calculateAdditionalStats = (team) => {
      const goalsFor = team.won * 2 + team.drawn; // Estimación simple
      const goalsAgainst = team.lost * 2 + team.drawn; // Estimación simple
      const goalDifference = goalsFor - goalsAgainst;
      const winPercentage = (team.won / team.played) * 100;
      
      return {
        goalsFor,
        goalsAgainst,
        goalDifference,
        winPercentage: winPercentage.toFixed(2)
      };
    };

    // Primera página - Tabla de Posiciones
    doc.addPage();
    drawFrame();
    drawHeader();

    const margin = 40;
    const tableTop = 180;
    const contentWidth = doc.page.width - (margin * 2) - 40;
    const columns = {
      posicion: { x: margin + 30, width: contentWidth * 0.05 },
      equipo: { x: margin + 30 + (contentWidth * 0.05), width: contentWidth * 0.25 },
      pj: { x: margin + 30 + (contentWidth * 0.3), width: contentWidth * 0.07 },
      pg: { x: margin + 30 + (contentWidth * 0.37), width: contentWidth * 0.07 },
      pe: { x: margin + 30 + (contentWidth * 0.44), width: contentWidth * 0.07 },
      pp: { x: margin + 30 + (contentWidth * 0.51), width: contentWidth * 0.07 },
      gf: { x: margin + 30 + (contentWidth * 0.58), width: contentWidth * 0.07 },
      gc: { x: margin + 30 + (contentWidth * 0.65), width: contentWidth * 0.07 },
      dg: { x: margin + 30 + (contentWidth * 0.72), width: contentWidth * 0.07 },
      puntos: { x: margin + 30 + (contentWidth * 0.79), width: contentWidth * 0.07 },
      forma: { x: margin + 30 + (contentWidth * 0.86), width: contentWidth * 0.14 }
    };

    // Encabezados de la tabla
    doc.font('Helvetica-Bold').fontSize(10);
    Object.entries(columns).forEach(([key, value]) => {
      const header = {
        posicion: 'Pos',
        equipo: 'Equipo',
        pj: 'PJ',
        pg: 'PG',
        pe: 'PE',
        pp: 'PP',
        gf: 'GF',
        gc: 'GC',
        dg: 'DG',
        puntos: 'Pts',
        forma: 'Forma'
      }[key];
      
      doc.text(header, value.x, tableTop, {
        width: value.width,
        align: 'left'
      });
    });

    // Línea separadora
    doc.moveTo(margin + 30, tableTop + 20)
       .lineTo(doc.page.width - margin - 30, tableTop + 20)
       .stroke();

    // Contenido de la tabla
    let currentY = tableTop + 30;
    doc.font('Helvetica').fontSize(9);

    leaderboard.forEach((team, index) => {
      const additionalStats = calculateAdditionalStats(team);
      
      doc.text((index + 1).toString(), columns.posicion.x, currentY)
         .text(team.team || 'N/A', columns.equipo.x, currentY)
         .text((team.played || 0).toString(), columns.pj.x, currentY)
         .text((team.won || 0).toString(), columns.pg.x, currentY)
         .text((team.drawn || 0).toString(), columns.pe.x, currentY)
         .text((team.lost || 0).toString(), columns.pp.x, currentY)
         .text(additionalStats.goalsFor.toString(), columns.gf.x, currentY)
         .text(additionalStats.goalsAgainst.toString(), columns.gc.x, currentY)
         .text(additionalStats.goalDifference.toString(), columns.dg.x, currentY)
         .text((team.points || 0).toString(), columns.puntos.x, currentY)
         .text(team.lastMatches.join(' '), columns.forma.x, currentY);

      currentY += 20;

      if (currentY > doc.page.height - 100) {
        doc.addPage();
        drawFrame();
        drawHeader();
        currentY = tableTop;
      }
    });
    drawFooter(1);

    // Segunda página - Gráfico de Puntos
    doc.addPage();
    drawFrame();
    const pointsData = leaderboard
      .sort((a, b) => (b.points || 0) - (a.points || 0))
      .slice(0, 10)
      .map(team => ({
        label: team.team || 'N/A',
        value: team.points || 0
      }));
    drawBarChart(pointsData, margin + 30, margin + 100, 500, 400, 'Top 10 Equipos por Puntos');
    drawFooter(2);

    // Tercera página - Gráfico de Porcentaje de Victorias
    doc.addPage();
    drawFrame();
    const winPercentageData = leaderboard
      .map(team => ({
        team: team.team,
        winPercentage: ((team.won / team.played) * 100).toFixed(2)
      }))
      .sort((a, b) => b.winPercentage - a.winPercentage)
      .slice(0, 10)
      .map(team => ({
        label: team.team || 'N/A',
        value: parseFloat(team.winPercentage)
      }));
    drawBarChart(winPercentageData, margin + 30, margin + 100, 500, 400, 'Top 10 Equipos por Porcentaje de Victorias');
    drawFooter(3);

    doc.end();
  } catch (error) {
    console.error('Error al generar el PDF de la tabla de posiciones:', error);
    res.status(500).json({
      success: false,
      message: 'Error al generar el PDF de la tabla de posiciones',
      error: error.message,
    });
  }
};

const getLeaderboardPDF = async (req, res) => {
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
    console.error('Error al obtener el PDF:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el PDF',
      error: error.message,
    });
  }
};

module.exports = {
  generateLeaderboardPDF,
  getLeaderboardPDF,
};