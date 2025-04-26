// authMiddleware.js
const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, 'tu_clave_secreta');
    req.user = decoded;
    next(); // continúa al siguiente middleware o ruta
  } catch (error) {
    return res.status(400).json({ message: 'Token inválido' });
  }
}

module.exports = authMiddleware;

