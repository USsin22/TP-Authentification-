const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Utilisateur = require('./models/Utilisateur');
const Produit = require('./models/Produit');
const Commande = require('./models/Commande');

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/tp_auth')
    .then(() => console.log('Connecté à MongoDB pour le seeding...'))
    .catch(err => console.error('Erreur de connexion MongoDB:', err));

const seedDB = async () => {
    try {
        // Nettoyer la base de données existante
        await Utilisateur.deleteMany({});
        await Produit.deleteMany({});
        await Commande.deleteMany({});

        // Ajouter 5 utilisateurs
        const passwordHash = await bcrypt.hash('password123', 10);
        const users = [];
        for (let i = 1; i <= 5; i++) {
            users.push({
                id: i,
                nom: `Nom${i}`,
                prenom: `Prenom${i}`,
                email: `user${i}@example.com`,
                mot_de_passe: passwordHash
            });
        }
        const createdUsers = await Utilisateur.insertMany(users);
        console.log('5 utilisateurs ajoutés !');

        // Ajouter 10 produits avec catégorie
        const products = [];
        const categories = ['Électronique', 'Mode', 'Maison', 'Sport'];
        for (let i = 1; i <= 10; i++) {
            products.push({
                id: i,
                nom: `Produit ${i}`,
                prix: Math.floor(Math.random() * 100) + 10,
                description: `Description détaillée du produit numéro ${i}`,
                categorie: categories[Math.floor(Math.random() * categories.length)]
            });
        }
        const createdProducts = await Produit.insertMany(products);
        console.log('10 produits ajoutés avec catégories !');

        // Ajouter quelques commandes
        const commandes = [];
        for (let i = 1; i <= 3; i++) {
            commandes.push({
                id: i,
                id_utilisateur: createdUsers[0]._id, // user1
                id_product: createdProducts[i]._id,
                quantite: Math.floor(Math.random() * 5) + 1,
                statut: 'en attente'
            });
        }
        await Commande.insertMany(commandes);
        console.log('3 commandes ajoutées !');

        console.log('Base de données initialisée avec succès.');
        process.exit();
    } catch (error) {
        console.error('Erreur lors du seeding:', error);
        process.exit(1);
    }
};

seedDB();
