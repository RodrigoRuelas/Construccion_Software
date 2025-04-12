const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.use(express.json());

// Ruta para servir el formulario HTML
app.get('/registro', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'formulario.html'));
});

// Endpoint para recibir los datos del formulario
app.post('/registro', (req, res) => {
  const { name, lastname, age, height, weight } = req.body;

  if (!name || !lastname || !age || !height || !weight) {
    return res.status(400).json({ result: false, msg: 'Faltan campos en el JSON' });
  }

  const userData = `Nombre: ${name}, Apellido: ${lastname}, Edad: ${age}, Altura: ${height}, Peso: ${weight}\n`;

  fs.appendFile('usuarios.txt', userData, (err) => {
    if (err) {
      console.error('Error al guardar:', err);
      return res.status(500).json({ result: false, msg: 'ERROR' });
    }

    res.json({ result: true, msg: 'OK' });
  });
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

