const express = require('express');
const mongoose = require('mongoose');

const authMiddleware = require('./authMiddleware');
const loginRoute = require('./loginRoute'); // este es el login

const bookRoutes = require('./bookRoutes');
const authorRoutes = require('./authorRoutes');
const authorBookRoutes = require('./authorBookRoutes');

const app = express();
app.use(express.json());

// Ruta pública
app.use(loginRoute);

// Rutas protegidas
app.use('/book', authMiddleware, bookRoutes);
app.use('/author', authMiddleware, authorRoutes);
app.use('/authorbook', authMiddleware, authorBookRoutes);

const start = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/Library');
    app.listen(3000, () => console.log('Server started on port 3000'));
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();

