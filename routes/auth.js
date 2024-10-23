const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); // generer le hashage mot de passe
const jwt = require('jsonwebtoken'); // generer un token
const User = require('../models/User');

// Route pour inscription
router.post('/signup', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10); // Hash le mot de passe
    const user = new User({
      email: req.body.email,
      password: hashedPassword, // stock le mot de passe hashé
    });
    await user.save();
    res.status(201).json({ message: 'Utilisateur créé !' });
  } catch (error) {
    res.status(400).json({ error });
  }
});

// Route pour connexion
router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ message: 'Utilisateur non trouvé !' });
    }
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Mot de passe incorrect !' });
    }
    const token = jwt.sign({ userId: user._id }, 'RANDOM_SECRET_TOKEN', { expiresIn: '24h' }); // generation du token , et l'expiration demande a l'utilisateur de se reconnecter pour eviter piratage de compte s'il y a.

    //Envoi du token vers le frontEnd
    res.status(200).json({ userId: user._id, token });
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;