const express = require("express");
const mongoose = require("mongoose");

const Book = require("./modelo_Book");
const Author = require("./modelo_Author");
const { AuthorBook } = require("./modelo_AuthorBook");

const app = express();
app.use(express.json());

// -------------------- CRUD BOOK --------------------
app.get("/book", async (req, res) => {
  const allBooks = await Book.find();
  res.status(200).json(allBooks);
});

app.get("/book/:id", async (req, res) => {
  const book = await Book.findById(req.params.id);
  res.status(200).json(book);
});

app.post("/book", async (req, res) => {
  const newBook = new Book({ ...req.body });
  const savedBook = await newBook.save();
  res.status(201).json(savedBook);
});

app.put("/book/:id", async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!updatedBook) return res.status(404).json({ message: "Libro no encontrado" });
    res.status(200).json(updatedBook);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/book/:id", async (req, res) => {
  const deletedBook = await Book.findByIdAndDelete(req.params.id);
  res.status(200).json(deletedBook);
});

// -------------------- CRUD AUTHOR --------------------
app.get("/author", async (req, res) => {
  const allAuthors = await Author.find();
  res.status(200).json(allAuthors);
});

app.get("/author/:id", async (req, res) => {
  const author = await Author.findById(req.params.id);
  res.status(200).json(author);
});

app.post("/author", async (req, res) => {
  const newAuthor = new Author({ ...req.body });
  const savedAuthor = await newAuthor.save();
  res.status(201).json(savedAuthor);
});

app.put("/author/:id", async (req, res) => {
  try {
    const updatedAuthor = await Author.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!updatedAuthor) return res.status(404).json({ message: "Autor no encontrado" });
    res.status(200).json(updatedAuthor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/author/:id", async (req, res) => {
  const deletedAuthor = await Author.findByIdAndDelete(req.params.id);
  res.status(200).json(deletedAuthor);
});

// -------------------- CRUD AUTHORBOOK --------------------
app.post("/authorbook", async (req, res) => {
  const { author_id, book_id } = req.body;

  const newRelation = new AuthorBook({ author_id, book_id });
  const savedRelation = await newRelation.save();

  res.status(201).json(savedRelation);
});

app.get("/author/:id/books", async (req, res) => {
  const { id } = req.params;

  const relations = await AuthorBook.find({ author_id: id }).populate("book_id");
  const books = relations.map(rel => rel.book_id);

  res.status(200).json(books);
});

app.get("/book/:id/authors", async (req, res) => {
  const { id } = req.params;

  const relations = await AuthorBook.find({ book_id: id }).populate("author_id");
  const authors = relations.map(rel => rel.author_id);

  res.status(200).json(authors);
});

// -------------------- CONEXIÓN --------------------
const start = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/Library");
    console.log("Connected to MongoDB");
    app.listen(3000, () => console.log("Servidor escuchando en puerto 3000"));
  } catch (error) {
    console.error("Error de conexión:", error.message);
    process.exit(1);
  }
};

start();

