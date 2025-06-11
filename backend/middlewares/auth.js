const jsonwebtoken = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; 

  if (!token) {
    return res.status(401).json({ message: 'Token manquant ou invalide.' });
  }

  try {
    const decoded = jsonwebtoken.verify(token, process.env.JWT_SECRET);
    if(req.body.userId && req.body.userId !== decoded.userId) {
      return res.status(401).json({ message: 'Utilisateur invalide.' });
    }
    req.user = decoded;
    next(); 
  } catch (error) {
    return res.status(401).json({ message: 'Token invalide ou expiré.' });
  }
}