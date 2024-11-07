const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'imagesAdd'); // Dossier où seront stockées les images
  },
  filename: (req, file, callback) => {
    const name = path.parse(file.originalname).name.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype] || 'webp';
    const filename = name + Date.now() + '.' + extension;
    callback(null, filename);
  },
});

const upload = multer({ storage }).single('image'); // Gestion d'un seul fichier image

module.exports = (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error("Erreur lors de l'upload du fichier:", err);
      return res.status(500).json({ error: "Erreur de téléchargement de fichier" });
    }

    if (!req.file) {
      return next(); // Pas de fichier à traiter
    }

    // Vérifie si le fichier est déjà au format .webp
    const isWebp = path.extname(req.file.filename).toLowerCase() === '.webp';

    if (isWebp) {
      console.log("Fichier déjà en .webp, aucun traitement supplémentaire requis.");
      return next(); // Passe au middleware suivant sans traitement
    }

    const tempFilePath = path.join(req.file.destination, req.file.filename);
    const outputFilePath = path.join(req.file.destination, path.parse(req.file.filename).name + '-converted.webp');

    try {
      console.log('Chemin temporaire du fichier:', tempFilePath);
      console.log('Chemin de sortie pour sharp:', outputFilePath);

      // Conversion en .webp avec Sharp
      await sharp(tempFilePath)
        .resize({ width: 500, height: 600, fit: 'inside' })
        .toFormat('webp')
        .toFile(outputFilePath);

      console.log("Conversion d'image en .webp réussie:", outputFilePath);

      // Supprime le fichier temporaire après un délai
      setTimeout(() => {
        try {
          fs.unlinkSync(tempFilePath);
          console.log("Fichier temporaire supprimé:", tempFilePath);
        } catch (unlinkErr) {
          console.error("Erreur lors de la suppression du fichier temporaire:", unlinkErr);
        }
      }, 1000);

      req.file.path = outputFilePath;
      req.file.filename = path.basename(outputFilePath);

      next();
    } catch (error) {
      console.error("Erreur de traitement d'image avec sharp:", error);
      return res.status(500).json({ error: "Erreur lors du traitement de l'image" });
    }
  });
};