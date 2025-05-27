require('dotenv').config();
const express = require('express');
const cors = require('cors'); 
const { connectToDatabase } = require('./src/models/db');

const estadisticasRoutes = require('./src/routes/estadisticasRoutes');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:4200', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
  allowedHeaders: ['Authorization', 'Content-Type'], 
  credentials: true, 
}));

app.use(express.json());

connectToDatabase()
  .then(() => {
    console.log('Conexión a la base de datos exitosa.');

    app.use('/api/estadisticas', estadisticasRoutes);

    app.listen(port, () => {
      console.log(`Servidor escuchando en http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Error al conectar a la base de datos:', error);
  });


  //? docker restart backend