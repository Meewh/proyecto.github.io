const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'SinHuevitos';

const usuarios = [
  { username: 'admin', password: '1234' },
  { username: 'user', password: 'user123' }
];

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  const usuario = usuarios.find(u => u.username === username && u.password === password);

  if (!usuario) {
    return res.status(401).json({ mensaje: 'Usuario o contraseña incorrecta' });
  }

  const token = jwt.sign({ username: usuario.username }, SECRET_KEY, { expiresIn: '24h' });

  res.json({ token });
});

module.exports = router;