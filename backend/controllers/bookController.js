const Book = require('../models/Book');
const fs = require('fs');


// ajouter un livre
exports.addBook = async (req, res) => {
  try {
    const bookData = JSON.parse(req.body.book);
    const book = new Book({
      ...bookData,
      userId: req.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/imagesAdd/${req.file.filename}`,
      ratings: [], // Initialise le tableau des notations vide
      averageRating: 0 // Initialise la note moyenne à 0
    });

    await book.save();
    res.status(201).json({ message: 'Livre ajouté avec succès !' });
  } catch (error) {
    console.error('Erreur dans addBook:', error.message);
    res.status(400).json({ error: error.message });
  }
};

// obtenir tous les livres
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.status(200).json(books);
  } catch (error) {
    res.status(400).json({ error });
  }
};

// optenir les livres par leur ID
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Livre non trouvé" });
    res.status(200).json(book);
  } catch (error) {
    res.status(400).json({ error });
  }
};

// les meilleurs notation de livre
exports.getBestRatedBooks = async (req, res) => {
  try {
    const books = await Book.find().sort({ averageRating: -1 }).limit(3);
    res.status(200).json(books);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// modification du book
exports.updateBook = async (req, res) => {
  const bookData = req.file ? JSON.parse(req.body.book) : req.body;
  const updateData = req.file
    ? { ...bookData, imageUrl: `${req.protocol}://${req.get('host')}/imagesAdd/${req.file.filename}` }
    : bookData;

  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Livre non trouvé' });

    // Verifie que l'utilisateur est bien le proprietaire du livre
    if (book.userId !== req.userId) {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    const updatedBook = await Book.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.status(200).json({ message: 'Livre mis à jour avec succès !' });
  } catch (error) {
    console.error('Erreur dans updateBook:', error.message);
    res.status(400).json({ error: error.message });
  }
};

// suppression du livre
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Livre non trouvé' });

    // Vérifie que l'utilisateur est bien le propriétaire du livre
    if (book.userId !== req.userId) {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    const filename = book.imageUrl.split('/imagesAdd/')[1];
    fs.unlink(`imagesAdd/${filename}`, async (unlinkErr) => {
      if (unlinkErr) {
        console.error("Erreur lors de la suppression de l'image:", unlinkErr);
      }
      await Book.deleteOne({ _id: req.params.id });
      res.status(200).json({ message: 'Livre supprimé avec succès !' });
    });
  } catch (error) {
    res.status(400).json({ error });
  }
};

// ajout de la notation
exports.addRating = async (req, res) => {
  try {
    const { userId, rating } = req.body;
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: 'Livre non trouvé' });

    if (book.ratings.some((r) => r.userId === userId)) {
      return res.status(400).json({ message: 'Vous avez déjà noté ce livre' });
    }

    const newRating = { userId, grade: Math.min(5, Math.max(0, rating)) };
    book.ratings.push(newRating);
    book.averageRating = book.ratings.reduce((acc, curr) => acc + curr.grade, 0) / book.ratings.length;
    await book.save();

    res.status(200).json(book);
  } catch (error) {
    console.error('Erreur dans addRating:', error.message);
    res.status(400).json({ error: error.message });
  }
};