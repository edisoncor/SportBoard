const PDFDocument = require('pdfkit');
const { getDb } = require('../models/db');
const path = require('path');

const generateTeamsPDF = async (req, res) => {
  try {
    const db = getDb();
    const teams = await db.collection('team').find().toArray();

    if (teams.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No se encontraron equipos en la base de datos',
      });
    }

    // Configuración inicial del documento
    const doc = new PDFDocument({
      margin: 50,
      size: 'A4',
      autoFirstPage: false  // Desactivamos la creación automática de la primera página
    });

    const buffers = [];
    doc.on('data', (chunk) => buffers.push(chunk));
    doc.on('end', async () => {
      const pdfBuffer = Buffer.concat(buffers);
      const pdfBase64 = pdfBuffer.toString('base64');
      await db.collection('PDFs').insertOne({
        name: `teams_${Date.now()}.pdf`,
        content: pdfBase64,
        createdAt: new Date(),
        type: 'teams',
      });

      res.status(201).json({
        success: true,
        message: 'PDF de equipos generado y almacenado exitosamente en la base de datos',
      });
    });

    // Colores institucionales y de equipos
    const colors = {
      green: '#006838',
      red: '#ED1C24',
      gold: '#FDB913',
      blue: '#0077BE',
      purple: '#8E44AD',
      orange: '#F39C12',
      teal: '#16A085'
    };

    const teamColors = {
      'Real Madrid': colors.green,
      'Manchester City': colors.blue,
      'Barcelona': colors.red,
      'Bayern Munich': colors.purple,
      'Liverpool': colors.orange,
      'Paris Saint-Germain': colors.teal
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
         .text('Reporte de Equipos', margin + logoSize + 20, margin + 60);

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
      const barWidth = (chartWidth / data.length) * 0.8; // 80% del espacio disponible

      // Título
      doc.font('Helvetica-Bold')
         .fontSize(16)
         .text(title, startX, startY, { align: 'center', width });

      const maxValue = Math.max(...data.map(d => d.value));

      // Barras y leyendas
      data.forEach((d, i) => {
        const barHeight = (d.value / maxValue) * chartHeight;
        const x = startX + margin.left + (i * (chartWidth / data.length)) + ((chartWidth / data.length - barWidth) / 2);
        const y = startY + margin.top + chartHeight - barHeight;

        // Barra
        doc.rect(x, y, barWidth, barHeight)
           .fill(teamColors[d.label]);

        // Valor sobre la barra
        doc.font('Helvetica-Bold')
           .fontSize(12)
           .fillColor('#000000')
           .text(d.value.toString(), x, y - 20, { 
             width: barWidth, 
             align: 'center' 
           });

        // Nombre del equipo
        doc.font('Helvetica')
           .fontSize(10)
           .text(d.label, x - 10, startY + height - margin.bottom + 10, { 
             width: barWidth + 20, 
             align: 'center' 
           });

        // Cuadrado de color para la leyenda
        const legendY = startY + height - margin.bottom + 40;
        doc.rect(x, legendY, 10, 10)
           .fill(teamColors[d.label]);
      });
    };

    // Función para dibujar gráfico circular
    const drawPieChart = (data, centerX, centerY, radius, title) => {
      const total = data.reduce((sum, item) => sum + item.value, 0);
      let currentAngle = 0;

      // Título
      doc.font('Helvetica-Bold')
         .fontSize(16)
         .text(title, centerX - 200, centerY - radius - 40, {
           width: 400,
           align: 'center'
         });

      // Sectores
      data.forEach((item, index) => {
        const sliceAngle = (item.value / total) * 2 * Math.PI;
        const endAngle = currentAngle + sliceAngle;

        // Sector
        doc.save()
           .moveTo(centerX, centerY)
           .arc(centerX, centerY, radius, currentAngle, endAngle)
           .lineTo(centerX, centerY)
           .fillAndStroke(teamColors[item.label], '#FFFFFF');

        // Leyenda
        const legendX = centerX - radius - 100;
        const legendY = centerY + radius + 40 + (index * 25);
        
        // Cuadrado de color
        doc.rect(legendX, legendY, 15, 15)
           .fill(teamColors[item.label]);

        // Texto de la leyenda
        doc.font('Helvetica')
           .fontSize(12)
           .fillColor('#000000')
           .text(`${item.label} (${item.value}%)`, 
                legendX + 25, 
                legendY + 2,
                { width: 200 });

        currentAngle = endAngle;
      });
    };

    // Primera página - Tabla
    doc.addPage();  // Agregamos explícitamente la primera página
    drawFrame();
    drawHeader();

    const margin = 40;
    const tableTop = 180;
    const contentWidth = doc.page.width - (margin * 2) - 40;
    const columns = {
      equipo: { x: margin + 30, width: contentWidth * 0.25 },
      jugados: { x: margin + 30 + (contentWidth * 0.25), width: contentWidth * 0.15 },
      ganados: { x: margin + 30 + (contentWidth * 0.4), width: contentWidth * 0.15 },
      puntos: { x: margin + 30 + (contentWidth * 0.55), width: contentWidth * 0.15 },
      posesion: { x: margin + 30 + (contentWidth * 0.7), width: contentWidth * 0.15 },
      golesFavor: { x: margin + 30 + (contentWidth * 0.85), width: contentWidth * 0.15 }
    };

    // Encabezados de la tabla
    doc.font('Helvetica-Bold')
       .fontSize(10);

    Object.entries(columns).forEach(([key, value]) => {
      const header = {
        equipo: 'Equipo',
        jugados: 'Jugados',
        ganados: 'Ganados',
        puntos: 'Puntos',
        posesion: 'Posesión',
        golesFavor: 'Goles a Favor'
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
    doc.font('Helvetica')
       .fontSize(9);

    teams.forEach((team) => {
      doc.text(team.team, columns.equipo.x, currentY)
         .text(team.played.toString(), columns.jugados.x, currentY)
         .text(team.won.toString(), columns.ganados.x, currentY)
         .text(team.points.toString(), columns.puntos.x, currentY)
         .text(team.possession, columns.posesion.x, currentY)
         .text(team.goalsFor.toString(), columns.golesFavor.x, currentY);

      currentY += 20;
    });
    drawFooter(1);

    // Segunda página - Gráfico de Puntos
    doc.addPage({ layout: doc.page.layout });  // Especificamos el layout
    drawFrame();
    const pointsData = teams.map(team => ({
      label: team.team,
      value: team.points
    }));
    drawBarChart(pointsData, margin + 30, margin + 100, 500, 400, 'Puntos por Equipo');
    drawFooter(2);

    // Tercera página - Gráfico de Posesión
    doc.addPage({ layout: doc.page.layout });  // Especificamos el layout
    drawFrame();
    const possessionData = teams.map(team => ({
      label: team.team,
      value: parseFloat(team.possession.replace('%', ''))
    }));
    drawPieChart(possessionData, 300, 250, 120, 'Posesión de Balón por Equipo');
    drawFooter(3);

    // Cuarta página - Gráfico de Goles
    doc.addPage({ layout: doc.page.layout });  // Especificamos el layout
    drawFrame();
    const goalsData = teams.map(team => ({
      label: team.team,
      value: team.goalsFor
    }));
    drawBarChart(goalsData, margin + 30, margin + 100, 500, 400, 'Goles a Favor por Equipo');
    drawFooter(4);

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