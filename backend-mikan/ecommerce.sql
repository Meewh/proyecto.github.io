CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    password VARCHAR(200) NOT NULL
);

CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    productCount INTEGER NOT NULL,
    imgSrc VARCHAR(500) NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    cost INTEGER NOT NULL,
    currency VARCHAR(10) NOT NULL,
    soldCount INTEGER DEFAULT 0,
    categoryId INTEGER NOT NULL,
    images JSON NOT NULL,

    FOREIGN KEY (categoryId)
        REFERENCES categories(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS calificacion (
    id SERIAL PRIMARY KEY,
    id_product INT NOT NULL,
    id_user INT NOT NULL,
    puntuacion INT NOT NULL CHECK (puntuacion BETWEEN 1 AND 5),
    comentario TEXT,
    fecha TIMESTAMP DEFAULT NOW(),

    FOREIGN KEY (id_product)
        REFERENCES products(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

    FOREIGN KEY (id_user)
        REFERENCES users(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);

CREATE TABLE cart (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    idUser INTEGER NOT NULL,
    productId INTEGER NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,

    FOREIGN KEY (idUser)
        REFERENCES users(id)
        ON UPDATE CASCADE
        ON DELETE CASCADE
);


    -- insertar datos de prueba


INSERT INTO users (id, username, nombre, apellido, telefono, password)
VALUES
(1, 'cat@gmail.com', 'Cucaracha', 'Petrobras', '099123456', '123456');








INSERT INTO products (
    id, name, description, cost, currency, soldCount, categoryId, images
)
VALUES 
    (50742, 'Pelota de básquetbol', 'Balón de baloncesto profesional, para interiores, tamaño 5, 27.5 pulgadas. Oficial de la NBA', 2999, 'UYU', 11, 102,
        '["img/prod50742_1.jpg","img/prod50742_2.jpg","img/prod50742_3.jpg","img/prod50742_4.jpg"]'::json
    ),

    (40281, 'Computadora de escritorio', 'Computadora de escritorio. Potencia y rendimiento, para juegos o trabajo', 2599, 'USD', 11, 105,
        '["img/prod40281_1.jpg","img/prod40281_2.jpg","img/prod40281_3.jpg","img/prod40281_4.jpg"]'::json
    ),

    (50741, 'Oso de peluche', 'Oso de peluche gigante, con el bebé. Resistente y lavable. Tus hijos los amarán', 2400, 'UYU', 97, 102,
        '["img/prod50741_1.jpg","img/prod50741_2.jpg","img/prod50741_3.jpg","img/prod50741_4.jpg"]'::json
    ),

    (50743, 'PlayStation 5', 'Maravíllate con increíbles gráficos y disfruta de nuevas funciones de PS5. Con E/S integrada.', 59999, 'UYU', 16, 102,
        '["img/prod50743_1.jpg","img/prod50743_2.jpg","img/prod50743_3.jpg","img/prod50743_4.jpg"]'::json
    ),

    (50744, 'Bicicleta', '¡La mejor BMX pequeña del mercado! Frenos traseros y cuadro duradero de acero Hi-Ten.', 10999, 'UYU', 8, 102,
        '["img/prod50744_1.jpg","img/prod50744_2.jpg","img/prod50744_3.jpg","img/prod50744_4.jpg"]'::json
    ),

    (50921, 'Chevrolet Onix Joy', 'Generación 2019, variedad de colores. Motor 1.0, ideal para ciudad.', 13500, 'USD', 14, 101,
        '["img/prod50921_1.jpg","img/prod50921_2.jpg","img/prod50921_3.jpg","img/prod50921_4.jpg"]'::json
    ),

    (50922, 'Fiat Way', 'La versión de Fiat que brinda confort y a un precio accesible.', 14500, 'USD', 52, 101,
        '["img/prod50922_1.jpg","img/prod50922_2.jpg","img/prod50922_3.jpg","img/prod50922_4.jpg"]'::json
    ),

    (50923, 'Suzuki Celerio', 'Un auto que se ha ganado la buena fama por su economía con el combustible.', 12500, 'USD', 25, 101,
        '["img/prod50923_1.jpg","img/prod50923_2.jpg","img/prod50923_3.jpg","img/prod50923_4.jpg"]'::json
    ),

    (50924, 'Peugeot 208', 'El modelo de auto que se sigue renovando y manteniendo su prestigio en comodidad.', 15200, 'USD', 17, 101,
        '["img/prod50924_1.jpg","img/prod50924_2.jpg","img/prod50924_3.jpg","img/prod50924_4.jpg"]'::json
    ),

    (50925, 'Bugatti Chiron', 'El mejor hiperdeportivo de mundo. Producción limitada a 500 unidades.', 3500000, 'USD', 0, 101,
        '["img/prod50925_1.jpg","img/prod50925_2.jpg","img/prod50925_3.jpg","img/prod50925_4.jpg"]'::json
    ),

    (60801, 'Juego de comedor', 'Un conjunto sencillo y sólido, ideal para zonas de comedor pequeñas, hecho en madera maciza de pino', 4000, 'UYU', 88, 103,
        '["img/prod60801_1.jpg","img/prod60801_2.jpg","img/prod60801_3.jpg","img/prod60801_4.jpg"]'::json
    ),

    (60802, 'Sofá', 'Cómodo sofá de tres cuerpos, con chaiselongue intercambiable. Ideal para las siestas', 24000, 'UYU', 12, 103,
        '["img/prod60802_1.jpg","img/prod60802_2.jpg","img/prod60802_3.jpg","img/prod60802_4.jpg"]'::json
    ),

    (60803, 'Armario', 'Diseño clásico con puertas con forma de panel. Espejo de cuerpo entero para ver cómo te queda la ropa', 8000, 'UYU', 24, 103,
        '["img/prod60803_1.jpg","img/prod60803_2.jpg","img/prod60803_3.jpg","img/prod60803_4.jpg"]'::json
    ),

    (60804, 'Mesa de centro', 'Añade más funciones a tu sala de estar, ya que te permite cambiar fácilmente de actividad.', 10000, 'UYU', 37, 103,
        '["img/prod60804_1.jpg","img/prod60804_2.jpg","img/prod60804_3.jpg","img/prod60804_4.jpg"]'::json
    );







INSERT INTO categories (
    id, name, description, productCount, imgSrc
)
VALUES 
    (101, 'Autos', 'Los mejores precios en autos 0 kilómetro, de alta y media gama.', 5, 'img/cat101_1.jpg'),
    (102, 'Juguetes', 'Encuentra aquí los mejores precios para niños/as de cualquier edad.', 4, 'img/cat102_1.jpg'),
    (103, 'Muebles', 'Muebles antiguos, nuevos y para ser armados por uno mismo.', 4, 'img/cat103_1.jpg'),
    (104, 'Herramientas', 'Herramientas para cualquier tipo de trabajo.', 0, 'img/cat104_1.jpg'),
    (105, 'Computadoras', 'Todo en cuanto a computadoras, para uso de oficina y/o juegos.', 1, 'img/cat105_1.jpg'),
    (106, 'Vestimenta', 'Gran variedad de ropa, nueva y de segunda mano.', 0, 'img/cat106_1.jpg'),
    (107, 'Electrodomésticos', 'Todos los electrodomésticos modernos y de bajo consumo.', 0, 'img/cat107_1.jpg'),
    (108, 'Deporte', 'Toda la variedad de indumentaria para todo tipo de deporte.', 0, 'img/cat108_1.jpg'),
    (109, 'Celulares', 'Celulares de todo tipo para cubrir todas las necesidades.', 0, 'img/cat109_1.jpg');











INSERT INTO product_comments (product, score, description, user, dateTime) 
VALUES
    (50741, 5, 'Precioso, a mi nena le encantó', 'silvia_fagundez', '2021-02-20 14:00:42'),
    (50741, 4, 'Esperaba que fuera más grande, pero es muy lindo.', 'majo_sanchez', '2021-01-11 16:26:10'),
    (50741, 5, 'Hermoso el oso. Quedamos encantados, lo recomiendo.', 'raul_añez', '2020-12-16 19:55:19'),
    (50741, 1, 'Se lo regalé a mi novia para que me perdone, pero no funcionó', 'flynn_rider', '2020-02-14 23:19:09'),

    (50742, 5, 'Perfecta. La que me recomendó el entrenador', 'karen_gonzalez', '2022-05-21 23:10:41'),
    (50742, 4, 'Es lo que esperaba. Ahora a entrenar mucho!', 'luis_salgueiro', '2021-10-30 06:33:53'),
    (50742, 5, 'Muy buena calidad.', 'carlos_diaz', '2020-11-02 09:28:45'),
    (50742, 5, 'Excelente. Para rememorar viejos tiempos y volver a sentirse un campeón.', 'scottie_pippen', '2019-11-09 21:15:29'),

    (50743, 5, 'Un lujo. Se la compré a mis hijos, pero creo que me la quedo yo.', 'saul_dominguez', '2022-04-18 13:20:56'),
    (50743, 5, 'Increibles los gráficos que tiene.', 'lucia_ralek', '2022-04-05 11:20:09'),
    (50743, 5, 'IM PRE SIO NAN TE.', 'mateo_diestre', '2022-03-21 22:38:39'),
    (50743, 5, 'Me cuesta creer lo que han avanzado las consolas', 'ralph_baer', '2022-01-04 11:16:48'),

    (50744, 5, 'Compra de último momento para la navidad. A mi nieto le gustó.', 'ignacio_paremon', '2021-12-24 23:59:59'),
    (50744, 2, 'Les pedí azul y me mandaron verde. La bicicleta es buena', 'mia_barboza', '2021-09-15 01:27:19'),
    (50744, 3, 'Es buena, pero le faltaron las rueditas.', 'julian_surech', '2021-03-24 20:11:19'),
    (50744, 4, 'Perfecta para que mis hijos vayan empezando a practicar.', 'mariana_pajon', '2021-01-18 05:22:50'),

    (50921, 3, 'Ya llevo un año con este auto y la verdad que tiene sus ventajas y desventajas', 'juan_pedro', '2020-02-25 18:03:52'),
    (50921, 5, 'Es un auto muy cómodo y en relación precio/calidad vale la pena!', 'maria_sanchez', '2020-01-17 13:42:18'),
    (50921, 4, 'Casi todo bien!, excepto por algún detalle de gusto personal', 'paola_perez', '2020-03-14 09:05:13'),
    (50921, 5, 'Un espectáculo el auto!', 'gustavo_trelles', '2020-02-21 15:05:22'),

    (50922, 3, 'Es un buen auto, pero el precio me pareció algo elevado', 'ema_perez', '2022-04-05 15:29:40'),
    (50922, 5, 'Muy buen auto, vale cada centavo', 'javier_santoalla', '2021-11-15 19:32:10'),
    (50922, 5, 'Me gusta como se comporta en tierra y pista', 'gonza_rodriguez', '2020-02-21 15:05:22'),

    (50923, 5, 'Gran opción. Bueno, bonito y barato', 'alfredo_bioy', '2022-02-15 20:19:20'),
    (50923, 4, 'No había el color que yo quería, pero lo demás está perfecto.', 'pablo_cibeles', '2021-05-24 19:25:43'),
    (50923, 5, 'Lo que busco cuando no compito', 'santiago_urrutia', '2020-12-03 14:15:33'),

    (50924, 5, 'Espectacular. Sport con potencia y confort.', 'maite_caceres', '2022-06-24 20:19:20'),

    (60801, 3, 'Es algo chico, pero está bien para una familia pequeña.', 'jaime_gil', '2021-12-02 11:23:32'),

    (60802, 4, 'Muy cómodo. Ideal para las siestas', 'ximena_fagundez', '2022-03-29 09:15:01'),
    (60802, 5, 'Lo compré para ver los partidos con mis amigos. Valió la pena.', 'marcelo_sosa', '2021-08-09 22:05:12'),

    (60803, 5, 'Es grande. Entra más de lo que parece', 'bruno_diaz', '2022-11-21 03:33:41');

