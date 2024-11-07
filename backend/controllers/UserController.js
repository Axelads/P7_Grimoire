// controllers/userController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Fonction pour l'inscription
exports.signup = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10); // Hash le mot de passe
    const user = new User({
      email: req.body.email,
      password: hashedPassword, // Stocke le mot de passe hashé
    });
    await user.save();
    res.status(201).json({ message: 'Utilisateur créé !' });
  } catch (error) {
    res.status(400).json({ error });
  }
};

// Fonction pour la connexion
exports.login = async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(401).json({ message: 'Utilisateur non trouvé !' });
      }
  
      // Comparaison du mot de passe
      const validPassword = await bcrypt.compare(req.body.password, user.password);
      if (!validPassword) {
        return res.status(401).json({ message: 'Mot de passe incorrect !' });
      }
  
      // Génération du token si la connexion est réussie
      const token = jwt.sign({ userId: user._id }, 'RANDOM_SECRET_TOKEN', { expiresIn: '24h' });
      res.status(200).json({ userId: user._id, token });
    } catch (error) {
      res.status(500).json({ error });
    }
  };