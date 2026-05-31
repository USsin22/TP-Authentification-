const express = require('express');
const router = express.Router();
const Produit = require('../models/Produit');
const authMiddleware = require('../middlewares/auth');

// Appliquer le middleware à toutes les routes de ce fichier
router.use(authMiddleware);

// Créer un produit
router.post('/', async (req, res) => {
    try {
        const lastProduct = await Produit.findOne().sort({ id: -1 });
        const newId = lastProduct ? lastProduct.id + 1 : 1;
        
        const produit = new Produit({ ...req.body, id: newId });
        await produit.save();
        res.status(201).json(produit);
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de la création du produit.' });
    }
});

// Lire tous les produits
router.get('/', async (req, res) => {
    try {
        const products = await Produit.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des produits.' });
    }
});

// Mettre à jour un produit
router.put('/:id', async (req, res) => {
    try {
        const product = await Produit.findOneAndUpdate({ id: req.params.id }, req.body, { new: true });
        if (!product) return res.status(404).json({ message: 'Produit non trouvé.' });
        res.json(product);
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de la mise à jour.' });
    }
});

// Supprimer un produit
router.delete('/:id', async (req, res) => {
    try {
        const product = await Produit.findOneAndDelete({ id: req.params.id });
        if (!product) return res.status(404).json({ message: 'Produit non trouvé.' });
        res.json({ message: 'Produit supprimé avec succès.' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression.' });
    }
});

module.exports = router;
