const express = require('express');
const mongoose = require('mongoose');

const app = express();

// Middlewares globaux
app.use(express.json());
app.use(express.static('public'));

// Connexion à MongoDB
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/tp_auth';
mongoose.connect(mongoURI)
    .then(() => console.log(`Connecté à MongoDB (${mongoURI})`))
    .catch(err => console.error('Erreur de connexion MongoDB:', err));

// Importation des routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const commandeRoutes = require('./routes/commandes');

// Utilisation des routes
app.use('/', authRoutes);
app.use('/products', productRoutes);
app.use('/commandes', commandeRoutes);

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
