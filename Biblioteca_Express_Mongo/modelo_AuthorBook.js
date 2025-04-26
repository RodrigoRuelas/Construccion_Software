// modelo_AuthorBook.js
const mongoose = require("mongoose");

const authorBookSchema = new mongoose.Schema({
  author_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Author",
    required: true,
  },
  book_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
    required: true,
  },
});

const AuthorBook = mongoose.model("AuthorBook", authorBookSchema);

module.exports = { AuthorBook };


