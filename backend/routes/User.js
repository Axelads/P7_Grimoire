const express = require('express');
const router = express.Router();
const userController = require('../controllers/UserController'); // Importer le contrôleur

// Route pour inscription
router.post('/signup', userController.signup);

// Route pour connexion
router.post('/login', userController.login);

module.exports = router;