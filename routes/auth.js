const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Utilisateur = require('../models/Utilisateur');

const JWT_SECRET = 'ma_cle_secrete_super_securisee';

// Inscription
router.post('/register', async (req, res) => {
    try {
        const { nom, prenom, email, mot_de_passe } = req.body;
        const existingUser = await Utilisateur.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'Cet email est déjà utilisé.' });

        const hashedPassword = await bcrypt.hash(mot_de_passe, 10);
        
        // Trouver le dernier ID pour l'incrémenter
        const lastUser = await Utilisateur.findOne().sort({ id: -1 });
        const newId = lastUser ? lastUser.id + 1 : 1;

        const newUser = new Utilisateur({ 
            id: newId,
            nom, 
            prenom, 
            email, 
            mot_de_passe: hashedPassword 
        });
        await newUser.save();

        res.status(201).json({ message: 'Utilisateur créé avec succès.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de l\'inscription.' });
    }
});

// Connexion
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body; // on garde 'password' pour le body de la requête
        const user = await Utilisateur.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Email ou mot de passe incorrect.' });

        const isMatch = await bcrypt.compare(password, user.mot_de_passe);
        if (!isMatch) return res.status(400).json({ message: 'Email ou mot de passe incorrect.' });

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la connexion.' });
    }
});

module.exports = router;
