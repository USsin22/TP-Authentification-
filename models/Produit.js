const mongoose = require('mongoose');

const produitSchema = new mongoose.Schema({
  id: {
    type: Number,
    unique: true
  },
  nom: {
    type: String,
    required: true
  },
  prix: {
    type: Number,
    required: true
  },
  description: String,
  categorie: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Produit', produitSchema);
