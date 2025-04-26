// modelo_Book.js
const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  publication_year: { type: Number, required: true },
  genre: { type: String, required: true },
});

module.exports = mongoose.model('Book', bookSchema);

