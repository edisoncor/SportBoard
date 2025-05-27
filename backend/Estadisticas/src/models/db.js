const { MongoClient } = require('mongodb');
require('dotenv').config();

let db;

async function connectToDatabase() {
  try {
    const client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    db = client.db(); 
    console.log('Conectado a la base de datos MongoDB');
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error.message);
    throw error;
  }
}

function getDb() {
  if (!db) {
    throw new Error('No hay conexión a la base de datos. Llama a connectToDatabase primero.');
  }
  return db;
}

module.exports = { connectToDatabase, getDb };
