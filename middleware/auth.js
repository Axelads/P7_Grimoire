const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; // Recuperer le token de "Authorization"
    const decodedToken = jwt.verify(token, 'RANDOM_SECRET_TOKEN'); // Verifier et decoder le token
    const userId = decodedToken.userId;

    // Verifie si l'ID utilisateur du token correspond à l'ID dans la requete
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID';
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('Invalid request!')
    });
  }
};