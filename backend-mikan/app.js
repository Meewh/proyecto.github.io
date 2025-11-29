var createError = require('http-errors');
var express = require('express');
var cors = require('cors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var catsRouter = require('./routes/cats');
const jwt = require("jsonwebtoken");
const fs = require("fs");
const JWT_SECRET = "curso-jap-secret";

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

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);
app.use('/cats', catsRouter);

const users = JSON.parse(fs.readFileSync("./mock_bd/users.json", "utf8"));

app.post("/login", (req, res) => {
  // Tomamos las credenciales enviadas por el formulario
  const { correo, password } = req.body;

  // Validamos que no vengan vacias
  if (!correo || !password) {
    return res.status(400).json({ message: "Correo y contraseña son obligatorios" });
  }

  // Buscamos el correo en el JSON cargado al iniciar el servidor
  const user = users.find((u) => u.correo === correo);
  if (!user) {
    return res.status(401).json({ message: "Credenciales inválidas" });
  }

  // Comparamos la contraseña en texto con el hash guardado
  if (password !== user.password) {
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

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;


app.listen(3000, () => {
  console.log('Server started on port 3000');
});