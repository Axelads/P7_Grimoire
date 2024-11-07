require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const authRoutes = require('./routes/User');
const booksRoutes = require('./routes/books');

const app = express();

// Connexion à MongoDB avec la variable d'environnement
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch((error) => console.error('Connexion à MongoDB échouée !', error));

app.use(bodyParser.json());

// CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000'); // Autorise uniquement le frontend
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200); // Gérer la requête préliminaire
  }
  next();
});

// Utilisation des routes d'authentification
app.use('/api/auth', authRoutes);
app.use('/api/books', booksRoutes);

// Utiliser le chemin absolu pour servir le dossier imageAdd grâce à path.join
app.use('/imagesAdd', express.static(path.join(__dirname, 'imagesAdd')));

module.exports = app;