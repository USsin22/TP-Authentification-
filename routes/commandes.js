const express = require('express');
const router = express.Router();
const Commande = require('../models/Commande');
const authMiddleware = require('../middlewares/auth');

// Appliquer le middleware à toutes les routes de ce fichier
router.use(authMiddleware);

// Créer une commande
router.post('/', async (req, res) => {
    try {
        const lastCommande = await Commande.findOne().sort({ id: -1 });
        const newId = lastCommande ? lastCommande.id + 1 : 1;

        const nouvelleCommande = new Commande({
            ...req.body,
            id: newId,
            id_utilisateur: req.user.id // Utilise l'ID de l'utilisateur connecté depuis le token
        });

        await nouvelleCommande.save();
        res.status(201).json(nouvelleCommande);
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Erreur lors de la création de la commande.' });
    }
});

// Récupérer toutes les commandes (avec détails utilisateur et produit)
router.get('/', async (req, res) => {
    try {
        const commandes = await Commande.find()
            .populate('id_utilisateur', 'nom prenom email')
            .populate('id_product', 'nom prix categorie');
        res.json(commandes);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des commandes.' });
    }
});

// Récupérer les commandes de l'utilisateur connecté
router.get('/mes-commandes', async (req, res) => {
    try {
        const commandes = await Commande.find({ id_utilisateur: req.user.id })
            .populate('id_product', 'nom prix categorie');
        res.json(commandes);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération de vos commandes.' });
    }
});

// Mettre à jour le statut d'une commande
router.put('/:id', async (req, res) => {
    try {
        const commande = await Commande.findOneAndUpdate(
            { id: req.params.id },
            { statut: req.body.statut },
            { new: true }
        );
        if (!commande) return res.status(404).json({ message: 'Commande non trouvée.' });
        res.json(commande);
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de la mise à jour de la commande.' });
    }
});

// Supprimer une commande
router.delete('/:id', async (req, res) => {
    try {
        const commande = await Commande.findOneAndDelete({ id: req.params.id });
        if (!commande) return res.status(404).json({ message: 'Commande non trouvée.' });
        res.json({ message: 'Commande supprimée avec succès.' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression.' });
    }
});

module.exports = router;
