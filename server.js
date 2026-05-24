const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(express.json());
app.use(express.static('public')); // Servir les fichiers statiques du dossier 'public'

// Clé secrète pour JWT (à mettre dans un fichier .env normalement)
const JWT_SECRET = 'ma_cle_secrete_super_securisee';

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/tp_auth')
    .then(() => console.log('Connecté à MongoDB'))
    .catch(err => console.error('Erreur de connexion MongoDB:', err));

// Modèle Utilisateur
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// Modèle Produit
const productSchema = new mongoose.Schema({
    nom: { type: String, required: true },
    prix: { type: Number, required: true },
    description: String
});

const Product = mongoose.model('Product', productSchema);

// Middleware d'authentification
const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Accès refusé. Aucun token fourni.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(400).json({ message: 'Token invalide.' });
    }
};

// --- ROUTES AUTHENTIFICATION ---

// Inscription
app.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'Cet email est déjà utilisé.' });

        // Hasher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Créer l'utilisateur
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'Utilisateur créé avec succès.' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de l\'inscription.' });
    }
});

// Connexion
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Trouver l'utilisateur
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Email ou mot de passe incorrect.' });

        // Vérifier le mot de passe
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Email ou mot de passe incorrect.' });

        // Créer le token JWT
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la connexion.' });
    }
});

// --- ROUTES PRODUITS (PROTÉGÉES) ---

// Créer un produit
app.post('/products', authMiddleware, async (req, res) => {
    try {
        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de la création du produit.' });
    }
});

// Lire tous les produits
app.get('/products', authMiddleware, async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des produits.' });
    }
});

// Mettre à jour un produit
app.put('/products/:id', authMiddleware, async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!product) return res.status(404).json({ message: 'Produit non trouvé.' });
        res.json(product);
    } catch (error) {
        res.status(400).json({ message: 'Erreur lors de la mise à jour.' });
    }
});

// Supprimer un produit
app.delete('/products/:id', authMiddleware, async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ message: 'Produit non trouvé.' });
        res.json({ message: 'Produit supprimé avec succès.' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression.' });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
