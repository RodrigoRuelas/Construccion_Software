const express = require('express');
const app = express();
const port = 3000;

// Middleware para interpretar JSON en el body
app.use(express.json());

// Endpoint POST
app.post('/operaciones', (req, res) => {
  const { numero1, numero2 } = req.body;

  // Validación básica
  if (typeof numero1 !== 'number' || typeof numero2 !== 'number') {
    return res.status(400).json({ error: 'Ambos valores deben ser números' });
  }

  // Realizamos las operaciones
  const suma = numero1 + numero2;
  const resta = numero1 - numero2;
  const multiplicacion = numero1 * numero2;
  const division = numero2 !== 0 ? (numero1 / numero2) : 'Error: División por cero';

  // Devolvemos los resultados en JSON
  res.json({
    suma,
    resta,
    multiplicacion,
    division
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

