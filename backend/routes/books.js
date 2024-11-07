const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const bookController = require('../controllers/bookController');

// Route pour ajouter un livre
router.post('/', auth, multer, bookController.addBook);

// Route pour obtenir les meilleurs notes
router.get('/bestrating', bookController.getBestRatedBooks);

// Route pour obtenir tous les livres
router.get('/', bookController.getAllBooks);

// Route pour obtenir un livre par ID
router.get('/:id', bookController.getBookById);

// Mettre à jour le livre
router.put('/:id', auth, multer, bookController.updateBook);

// Supprimer le livre
router.delete('/:id', auth, bookController.deleteBook);

// Ajouter une note à un livre
router.post('/:id/rating', auth, bookController.addRating);

module.exports = router;