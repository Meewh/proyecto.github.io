var createError = require('http-errors');
var express = require('express');
var cors = require('cors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var catsRouter = require('./routes/cats');
const jwt = require("jsonwebtoken");
const fs = require("fs");
require('dotenv').config();
const JWT_SECRET = "curso-jap-secret";

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productsRouter = require('./routes/products');
var cartRouter = require('./routes/cart');

var app = express();

app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ============================
// PUNTO 3 + 4: JWT y AUTH
// ============================
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'SinHuevitos';

// Middleware de autorización (Punto 4)
const verificarToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ mensaje: 'Acceso denegado: token requerido' });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    jwt.verify(token, SECRET_KEY);
    next();
  } catch (error) {
    return res.status(401).json({ mensaje: 'Token inválido o expirado' });
  }
};

// Endpoint LOGIN (Punto 3)
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  const usuariosValidos = [
    { username: 'admin', password: '1234' },
    { username: 'user', password: 'user123' }
  ];
  
  const usuario = usuariosValidos.find(u => u.username === username && u.password === password);
  
  if (!usuario) {
    return res.status(401).json({ mensaje: 'Usuario o contraseña incorrectos' });
  }
  
  const token = jwt.sign({ username: usuario.username }, SECRET_KEY, { expiresIn: '24h' });
  res.json({ token });
});

// ============================
// RUTAS MONTADAS (ya están protegidas dentro de cada router)
// ============================
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/cats', catsRouter);
app.use('/cart', cartRouter);

const users = JSON.parse(fs.readFileSync("./mock_bd/users.json", "utf8"));

app.post("/login", (req, res) => {
  // Tomamos las credenciales enviadas por el formulario
  const { correo, contraseña } = req.body;

  // Validamos que no vengan vacias
  if (!correo || !contraseña) {
    return res.status(400).json({ message: "Correo y contraseña son obligatorios" });
  }

  // Buscamos el correo en el JSON cargado al iniciar el servidor
  const user = users.find((u) => u.correo === correo);
  if (!user) {
    return res.status(401).json({ message: "Credenciales inválidas" });
  }

  // Comparamos la contraseña en texto con el hash guardado
  if (contraseña !== user.contraseña) {
    return res.status(401).json({ message: "Credenciales inválidas" });
  }

  // Firmamos un token sencillo con el id y correo
  const token = jwt.sign({ id: user.id, correo: user.correo }, JWT_SECRET, { expiresIn: "4h" });
  //Crear un token (una "llave") para probar que está logueado
  res.json({
    token,
    user: {
      id: user.id,
      correo: user.correo,
      nombre: user.nombre,
      apellido: user.apellido,
      telefono: user.telefono
    },
  });
});

// --------------------------------------------------------
// EDITAR PERFIL (actualiza el JSON mock)
// --------------------------------------------------------

app.put("/users/:id", (req, res) => {
  const { id } = req.params;
  const { nombre, apellido, correo, telefono } = req.body;

  // Buscar usuario por ID
  const userIndex = users.findIndex(u => u.id == id);

  if (userIndex === -1) {
    return res.status(404).json({ message: "Usuario no encontrado" });
  }

  // Actualizar datos del usuario
  if (nombre !== undefined) users[userIndex].nombre = nombre;
  if (apellido !== undefined) users[userIndex].apellido = apellido;
  if (correo !== undefined) users[userIndex].correo = correo;
  if (telefono !== undefined) users[userIndex].telefono = telefono;

  // Guardar en el archivo
  fs.writeFileSync("./mock_bd/users.json", JSON.stringify(users, null, 2));

  // 🔥 Crear un nuevo token actualizado
  const updatedUser = users[userIndex];

  const nuevoToken = jwt.sign(
    {
      id: updatedUser.id,
      correo: updatedUser.correo
    },
    JWT_SECRET,
    { expiresIn: "4h" }
  );

  // Respuesta
  res.json({
    message: "Perfil actualizado correctamente",
    token: nuevoToken,
    user: updatedUser
  });
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

app.listen(3000, () => {
  console.log('Server started on port 3000');
});