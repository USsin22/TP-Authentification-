const mongoose = require('mongoose');

const commandeSchema = new mongoose.Schema({
    id:{
    type: Number,
    unique: true
  },
  id_utilisateur: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Utilisateur',
    required: true
  },
  id_product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Produit',
    required: true
  },
  quantite: {
    type: Number,
    required: true,
    default: 1
  },
  statut: {
    type: String,
    enum: ['en attente', 'payé', 'expédié', 'annulé'],
    default: 'en attente'
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Commande', commandeSchema);
