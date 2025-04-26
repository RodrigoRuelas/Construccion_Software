const express = require("express");
const mongoose = require("mongoose");

const { Libro } = require("./modelo_libro");

const app = express();

app.use(express.json());

// Listar libros
app.get("/libros", async (req, res) => {
  const allLibro = await Libro.find();
  return res.status(200).json(allLibro);
});

// Listar libro por id
app.get("/libros/:id", async (req, res) => {
  const { id } = req.params;
  const libro = await Libro.findById(id);
  return res.status(200).json(libro);
});

// Insertar libro
app.post("/libros", async (req, res) => {
  const newLibro = new Libro({ ...req.body });
  const insertedLibro = await newLibro.save();
  return res.status(201).json(insertedLibro);
});

// Actualizar libro
app.put("/libros/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedLibro = await Libro.findByIdAndUpdate(id, req.body, {
      new: true, // devuelve el documento actualizado
      runValidators: true // valida según el esquema
    });
    if (!updatedLibro) {
      return res.status(404).json({ message: "Libro no encontrado" });
    }
    return res.status(200).json(updatedLibro);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});


// Eliminar libro
app.delete("/libros/:id", async (req, res) => {
  const { id } = req.params;
  const deletedLibro = await Libro.findByIdAndDelete(id);
  return res.status(200).json(deletedLibro);
});

const start = async () => {
  try {
    await mongoose.connect(
      "mongodb://localhost:27017/Libros"
    );
    app.listen(3000, () => console.log("Server started on port 3000"));
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

start();
