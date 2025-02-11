const PDFDocument = require('pdfkit');
const { getDb } = require('../models/db');
const path = require('path');

const generateMatchesPDF = async (req, res) => {
  try {
    const db = getDb();
    const matches = await db.collection('match').find().toArray();

    if (matches.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No se encontraron partidos en la base de datos',
      });
    }

    const doc = new PDFDocument({
      margin: 50,
      size: 'A4'
    });

    const buffers = [];
    doc.on('data', (chunk) => buffers.push(chunk));
    doc.on('end', async () => {
      const pdfBuffer = Buffer.concat(buffers);
      const pdfBase64 = pdfBuffer.toString('base64');
      await db.collection('PDFs').insertOne({
        name: `matches_${Date.now()}.pdf`,
        content: pdfBase64,
        createdAt: new Date(),
        type: 'matches',
      });

      res.status(201).json({
        success: true,
        message: 'PDF de partidos generado y almacenado exitosamente en la base de datos',
      });
    });

    // Colores institucionales
    const colors = {
      green: '#006838',
      red: '#ED1C24',
      gold: '#FDB913'
    };

    // Función para dibujar el marco completo
    const drawFrame = () => {
      const margin = 40;
      const width = doc.page.width - (margin * 2);
      const height = doc.page.height - (margin * 2);

      // Marco exterior verde
      doc.save()
         .lineWidth(2)
         .strokeColor(colors.green)
         .rect(margin, margin, width, height)
         .stroke();

      // Marco interior rojo
      doc.save()
         .lineWidth(2)
         .strokeColor(colors.red)
         .rect(margin + 5, margin + 5, width - 10, height - 10)
         .stroke();
    };

    // Función para dibujar el header de la primera página
    const drawFirstPageHeader = () => {
      const margin = 40;
      const logoSize = 60;
      
      // Logo solo en la primera página
      const logoPath = path.join(__dirname, '../assets/Universidad-Nacional-de-Loja-UNL.png');
      doc.image(logoPath, margin + 10, margin + 10, { 
        width: logoSize,
        height: logoSize
      });

      // Líneas decorativas superiores
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

      // Título
      doc.font('Helvetica-Bold')
         .fontSize(16)
         .text('UNIVERSIDAD NACIONAL DE LOJA', margin + logoSize + 20, margin + 40);

      doc.font('Helvetica')
         .fontSize(14)
         .text('Reporte de Partidos', margin + logoSize + 20, margin + 60);

      doc.moveDown(3);
    };

    // Función para dibujar el footer
    const drawFooter = (pageNumber) => {
      const margin = 40;
      const y = doc.page.height - margin - 20;

      // Líneas decorativas inferiores
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

      // Número de página (sutil)
      doc.fontSize(8)
         .fillColor('#666666')
         .text(
           `${pageNumber}`,
           margin,
           y + 12,
           { align: 'right', width: doc.page.width - (margin * 2) }
         );
    };

    // Primera página
    drawFrame();
    drawFirstPageHeader();

    // Configuración de la tabla
    const margin = 40;
    const tableTop = 180;
    const contentWidth = doc.page.width - (margin * 2) - 40;
    const columns = {
      fecha: { x: margin + 30, width: contentWidth * 0.15 },
      local: { x: margin + 30 + (contentWidth * 0.15), width: contentWidth * 0.25 },
      visitante: { x: margin + 30 + (contentWidth * 0.4), width: contentWidth * 0.25 },
      resultado: { x: margin + 30 + (contentWidth * 0.65), width: contentWidth * 0.15 },
      estadio: { x: margin + 30 + (contentWidth * 0.8), width: contentWidth * 0.2 }
    };

    // Encabezados de la tabla
    doc.font('Helvetica-Bold')
       .fontSize(11);

    Object.entries(columns).forEach(([key, value]) => {
      const header = {
        fecha: 'Fecha',
        local: 'Local',
        visitante: 'Visitante',
        resultado: 'Resultado',
        estadio: 'Estadio'
      }[key];
      
      doc.text(header, value.x, tableTop, {
        width: value.width,
        align: 'left'
      });
    });

    // Línea bajo los encabezados
    doc.moveTo(margin + 30, tableTop + 20)
       .lineTo(doc.page.width - margin - 30, tableTop + 20)
       .stroke();

    // Contenido de la tabla
    let currentY = tableTop + 30;
    doc.font('Helvetica')
       .fontSize(10);

    matches.forEach((match) => {
      if (currentY > doc.page.height - margin - 60) {
        drawFooter(doc.bufferedPageRange().count + 1);
        doc.addPage();
        drawFrame(); // Solo dibuja el marco en las páginas siguientes
        currentY = margin + 50; // Ajuste del margen superior para páginas siguientes

        // Repetir encabezados en nueva página
        doc.font('Helvetica-Bold')
           .fontSize(11);
        Object.entries(columns).forEach(([key, value]) => {
          const header = {
            fecha: 'Fecha',
            local: 'Local',
            visitante: 'Visitante',
            resultado: 'Resultado',
            estadio: 'Estadio'
          }[key];
          
          doc.text(header, value.x, currentY, {
            width: value.width,
            align: 'left'
          });
        });

        doc.moveTo(margin + 30, currentY + 20)
           .lineTo(doc.page.width - margin - 30, currentY + 20)
           .stroke();

        currentY += 30;
      }

      doc.font('Helvetica')
         .fontSize(10)
         .text(new Date(match.date).toLocaleDateString(), columns.fecha.x, currentY)
         .text(match.homeTeam, columns.local.x, currentY)
         .text(match.awayTeam, columns.visitante.x, currentY)
         .text(match.score, columns.resultado.x, currentY)
         .text(match.stadium || 'N/A', columns.estadio.x, currentY);

      currentY += 25;
    });

    // Dibujar footer en la última página
    drawFooter(doc.bufferedPageRange().count + 1);

    doc.end();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al generar el PDF de partidos',
      error: error.message,
    });
  }
};

const getMatchesPDF = async (req, res) => {
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
  generateMatchesPDF,
  getMatchesPDF,
};