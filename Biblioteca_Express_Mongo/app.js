const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const Book = require("./modelo_Book");
const Author = require("./modelo_Author");
const { AuthorBook } = require("./modelo_AuthorBook");
const User = require("./modelo_User");

const app = express();
app.use(express.json());

const JWT_SECRET = "miclavesecreta123";

// -------------------- RUTA PARA CREAR USUARIO --------------------
app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  
  console.log("Recibiendo solicitud para registrar usuario:", username);  // Log para verificar la entrada

  try {
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Usuario ya existe' });
    }

    // Generar el hash de la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear un nuevo usuario
    const newUser = new User({
      username,
      password: hashedPassword,
    });

    console.log("Nuevo usuario creado:", newUser);  // Log para verificar la creación del usuario

    // Guardar el usuario en la base de datos
    await newUser.save();
    res.status(201).json({ message: 'Usuario creado exitosamente' });

  } catch (error) {
    console.error("Error al crear el usuario:", error.message);  // Log para cualquier error
    res.status(500).json({ message: 'Error al crear el usuario' });
  }
});


// -------------------- LOGIN --------------------
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  if (!user) return res.status(400).json({ message: "Usuario no encontrado" });

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(400).json({ message: "Contraseña incorrecta" });

  const token = jwt.sign({ id: user._id, username: user.username }, JWT_SECRET, { expiresIn: "1h" });

  res.status(200).json({ token });
});

// -------------------- Middleware de Autenticación --------------------
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401); // No autorizado

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403); // Token inválido
    req.user = user;
    next();
  });
};

// -------------------- CRUD BOOK --------------------
app.get("/book", authenticateToken, async (req, res) => {
  const allBooks = await Book.find();
  res.status(200).json(allBooks);
});

app.get("/book/:id", authenticateToken, async (req, res) => {
  const book = await Book.findById(req.params.id);
  res.status(200).json(book);
});

app.post("/book", authenticateToken, async (req, res) => {
  const newBook = new Book({ ...req.body });
  const savedBook = await newBook.save();
  res.status(201).json(savedBook);
});

app.put("/book/:id", authenticateToken, async (req, res) => {
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

app.delete("/book/:id", authenticateToken, async (req, res) => {
  const deletedBook = await Book.findByIdAndDelete(req.params.id);
  res.status(200).json(deletedBook);
});

// -------------------- CRUD AUTHOR --------------------
app.get("/author", authenticateToken, async (req, res) => {
  const allAuthors = await Author.find();
  res.status(200).json(allAuthors);
});

app.get("/author/:id", authenticateToken, async (req, res) => {
  const author = await Author.findById(req.params.id);
  res.status(200).json(author);
});

app.post("/author", authenticateToken, async (req, res) => {
  const newAuthor = new Author({ ...req.body });
  const savedAuthor = await newAuthor.save();
  res.status(201).json(savedAuthor);
});

app.put("/author/:id", authenticateToken, async (req, res) => {
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

app.delete("/author/:id", authenticateToken, async (req, res) => {
  const deletedAuthor = await Author.findByIdAndDelete(req.params.id);
  res.status(200).json(deletedAuthor);
});

// -------------------- CRUD AUTHORBOOK --------------------
app.post("/authorbook", authenticateToken, async (req, res) => {
  const { author_id, book_id } = req.body;

  const newRelation = new AuthorBook({ author_id, book_id });
  const savedRelation = await newRelation.save();

  res.status(201).json(savedRelation);
});

app.get("/author/:id/books", authenticateToken, async (req, res) => {
  const { id } = req.params;

  const relations = await AuthorBook.find({ author_id: id }).populate("book_id");
  const books = relations.map(rel => rel.book_id);

  res.status(200).json(books);
});

app.get("/book/:id/authors", authenticateToken, async (req, res) => {
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

