const PDFDocument = require('pdfkit');
const { getDb } = require('../models/db');
const path = require('path');

const generatePlayersPDF = async (req, res) => {
  try {
    const db = getDb();
    const players = await db.collection('player').find().toArray();

    if (players.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No se encontraron jugadores en la base de datos',
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
        name: `players_${Date.now()}.pdf`,
        content: pdfBase64,
        createdAt: new Date(),
        type: 'players',
      });

      res.status(201).json({
        success: true,
        message: 'PDF de jugadores generado y almacenado exitosamente en la base de datos',
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
         .text('Reporte de Jugadores', margin + logoSize + 20, margin + 60);

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

    // Función para dibujar gráfico circular
    const drawPieChart = (data, centerX, centerY, radius, title) => {
      const total = data.reduce((sum, item) => sum + item.value, 0);
      let currentAngle = 0;

      doc.font('Helvetica-Bold')
         .fontSize(16)
         .text(title, centerX - 200, centerY - radius - 40, {
           width: 400,
           align: 'center'
         });

      data.forEach((item, index) => {
        const sliceAngle = (item.value / total) * 2 * Math.PI;
        const endAngle = currentAngle + sliceAngle;

        doc.save()
           .moveTo(centerX, centerY)
           .arc(centerX, centerY, radius, currentAngle, endAngle)
           .lineTo(centerX, centerY)
           .fillAndStroke(colors[Object.keys(colors)[index % Object.keys(colors).length]], '#FFFFFF');

        const legendX = centerX - radius - 100;
        const legendY = centerY + radius + 40 + (index * 25);
        
        doc.rect(legendX, legendY, 15, 15)
           .fill(colors[Object.keys(colors)[index % Object.keys(colors).length]]);

        doc.font('Helvetica')
           .fontSize(12)
           .fillColor('#000000')
           .text(`${item.label} (${item.value})`, 
                legendX + 25, 
                legendY + 2,
                { width: 200 });

        currentAngle = endAngle;
      });
    };

    // Primera página - Tabla de Jugadores
    doc.addPage();
    drawFrame();
    drawHeader();

    const margin = 40;
    const tableTop = 180;
    const contentWidth = doc.page.width - (margin * 2) - 40;
    const columns = {
      nombre: { x: margin + 30, width: contentWidth * 0.25 },
      equipo: { x: margin + 30 + (contentWidth * 0.25), width: contentWidth * 0.2 },
      posicion: { x: margin + 30 + (contentWidth * 0.45), width: contentWidth * 0.15 },
      goles: { x: margin + 30 + (contentWidth * 0.6), width: contentWidth * 0.1 },
      asistencias: { x: margin + 30 + (contentWidth * 0.7), width: contentWidth * 0.15 },
      valoracion: { x: margin + 30 + (contentWidth * 0.85), width: contentWidth * 0.15 }
    };

    // Encabezados de la tabla
    doc.font('Helvetica-Bold').fontSize(10);
    Object.entries(columns).forEach(([key, value]) => {
      const header = {
        nombre: 'Nombre',
        equipo: 'Equipo',
        posicion: 'Posición',
        goles: 'Goles',
        asistencias: 'Asistencias',
        valoracion: 'Valoración'
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

    players.forEach((player) => {
      doc.text(player.name, columns.nombre.x, currentY)
         .text(player.team, columns.equipo.x, currentY)
         .text(player.position, columns.posicion.x, currentY)
         .text(player.goals.toString(), columns.goles.x, currentY)
         .text(player.assists.toString(), columns.asistencias.x, currentY)
         .text(player.rating.toString(), columns.valoracion.x, currentY);

      currentY += 20;

      if (currentY > doc.page.height - 100) {
        doc.addPage();
        drawFrame();
        drawHeader();
        currentY = tableTop;
      }
    });
    drawFooter(1);

    // Segunda página - Gráfico de Goles
    doc.addPage();
    drawFrame();
    const goalsData = players.sort((a, b) => b.goals - a.goals).slice(0, 10).map(player => ({
      label: player.name,
      value: player.goals
    }));
    drawBarChart(goalsData, margin + 30, margin + 100, 500, 400, 'Top 10 Goleadores');
    drawFooter(2);

    // Tercera página - Gráfico de Asistencias
    doc.addPage();
    drawFrame();
    const assistsData = players.sort((a, b) => b.assists - a.assists).slice(0, 10).map(player => ({
      label: player.name,
      value: player.assists
    }));
    drawBarChart(assistsData, margin + 30, margin + 100, 500, 400, 'Top 10 Asistentes');
    drawFooter(3);

    // Cuarta página - Gráfico de Valoraciones
    doc.addPage();
    drawFrame();
    const ratingData = players.sort((a, b) => b.rating - a.rating).slice(0, 10).map(player => ({
      label: player.name,
      value: player.rating
    }));
    drawPieChart(ratingData, 300, 250, 120, 'Top 10 Jugadores por Valoración');
    drawFooter(4);

    doc.end();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al generar el PDF de jugadores',
      error: error.message,
    });
  }
};

const getPlayersPDF = async (req, res) => {
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
  generatePlayersPDF,
  getPlayersPDF,
};