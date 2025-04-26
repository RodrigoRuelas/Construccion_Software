const mongoose = require("mongoose");

const LibroSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  pages: {
    type: Number,
    required: true,
    validate: {
        validator: function (value) {
            return value > 0;
            },
            message: () => "Please enter a valid age",
        },
  },
  genres: {
    type: String,
    required: true,
  },
});

const Libro = mongoose.model("Libro", LibroSchema);

module.exports = { Libro };
