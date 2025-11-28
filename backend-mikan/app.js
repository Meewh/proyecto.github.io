var createError = require('http-errors');
var express = require('express');
var cors = require('cors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var catsRouter = require('./routes/cats');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productsRouter = require('./routes/products');

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