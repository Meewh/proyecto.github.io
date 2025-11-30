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
(1, 'cat@jap.com', 'Cucaracha', 'Petrobras', '099123456', '123456');

INSERT INTO products (
    id, name, description, cost, currency, soldCount, categoryId, images
)
VALUES (
    50742,
    'Pelota de básquetbol',
    'Balón de baloncesto profesional, para interiores, tamaño 5, 27.5 pulgadas. Oficial de la NBA',
    2999,
    'UYU',
    11,
    102,
    '[
        "img/prod50742_1.jpg",
        "img/prod50742_2.jpg",
        "img/prod50742_3.jpg",
        "img/prod50742_4.jpg"
    ]'::json
);

INSERT INTO categories (
    id, name, description, productCount, imgSrc
)
VALUES (
    102,
    'Juguetes',
    'Encuentra aquí los mejores precios para niños/as de cualquier edad.',
    4,
    'img/cat102_1.jpg'
);