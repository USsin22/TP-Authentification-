const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/tp_auth')
    .then(() => console.log('Connecté à MongoDB pour le seeding...'))
    .catch(err => console.error('Erreur de connexion MongoDB:', err));

// Modèles (Redéfinis ici pour plus de simplicité)
const User = mongoose.model('User', new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}));

const Product = mongoose.model('Product', new mongoose.Schema({
    nom: { type: String, required: true },
    prix: { type: Number, required: true },
    description: String
}));

const seedDB = async () => {
    try {
        // Nettoyer la base de données existante (optionnel)
        await User.deleteMany({});
        await Product.deleteMany({});

        // Ajouter 5 utilisateurs
        const passwordHash = await bcrypt.hash('password123', 10);
        const users = [];
        for (let i = 1; i <= 5; i++) {
            users.push({
                email: `user${i}@example.com`,
                password: passwordHash
            });
        }
        await User.insertMany(users);
        console.log('5 utilisateurs ajoutés !');

        // Ajouter 10 produits
        const products = [];
        for (let i = 1; i <= 10; i++) {
            products.push({
                nom: `Produit ${i}`,
                prix: Math.floor(Math.random() * 100) + 10,
                description: `Description détaillée du produit numéro ${i}`
            });
        }
        await Product.insertMany(products);
        console.log('10 produits ajoutés !');

        console.log('Base de données initialisée avec succès.');
        process.exit();
    } catch (error) {
        console.error('Erreur lors du seeding:', error);
        process.exit(1);
    }
};

seedDB();
