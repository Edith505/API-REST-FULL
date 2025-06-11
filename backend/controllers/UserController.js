const UserModel = require('../models/UserModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = {
  // Inscription utilisateur
  signUp: async (req, res) => {
    try {
      const { username, firstName, lastName, email, password, avatar } = req.body;
      if (!username || !email || !password) {
        return res.status(400).json({ message: "Username, email et password sont obligatoires." });
      }

      // Vérifier si l'email existe déjà (sécurité supplémentaire)
      const existing = await UserModel.findOne({ email });
      if (existing) {
        return res.status(400).json({ message: "Cet email est déjà utilisé." });
      }

      // Hash du mot de passe
      const hashedPassword = await bcrypt.hash(password, 10);

      // Création de l'utilisateur
      const user = new UserModel({
        username,
        firstName,
        lastName,
        email,
        password: hashedPassword,
        avatar
      });

      await user.save();
      res.status(201).json({ message: "Inscription réussie." });
    } catch (error) {
      // Gestion erreur uniqueValidator
      if (error.name === "ValidationError") {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: "Erreur serveur lors de l'inscription.", error: error.message });
    }
  },

  // Connexion utilisateur
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ message: "Email et mot de passe requis." });
      }

      const user = await UserModel.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "Identifiants incorrects." });
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return res.status(400).json({ message: "Identifiants incorrects." });
      }

      // Génération du token JWT
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "2h" }
      );

      // On ne renvoie jamais le mot de passe !
      res.status(200).json({
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          avatar: user.avatar
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Erreur serveur lors de la connexion.", error: error.message });
    }
  }
};