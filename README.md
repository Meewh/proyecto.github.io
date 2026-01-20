# 🛒 Proyecto E-commerce – Backend & Frontend  
**Entrega 8 – Jóvenes a Programar 2025 (Grupo 3)**

Proyecto de e-commerce con **backend en Node.js + Express**, **autenticación con JWT**, **carrito persistido en base de datos** y frontend conectado mediante endpoints REST.

> _“Kenny le quitó la varita a Naty sin saber usarla… pero el backend sí sabe lo que hace.”_

---

## 👥 Integrantes

- **Alexis Borges** – *El Forjador de Código*  
  Endpoints generales y conexión con la base de datos  
  GitHub: https://github.com/Alen-Borges

- **Suany Gomes** – *La Guardiana del Vínculo*  
  Login de usuario con JWT y middleware  
  GitHub: https://github.com/Meewh

- **Gio Miggones** – *El Traductor de Runas*  
  GitHub: https://github.com/VendingMachineEnjoyer

- **Anthony Rodríguez** – *El Tejedor de UIs*  
  UML y script de creación de la base de datos  
  GitHub: https://github.com/annpose

---

## 🐱 Repositorio y Demo

- **Repositorio GitHub**  
  https://github.com/Meewh/proyecto.github.io

- **GitHub Pages**  
  https://meewh.github.io/proyecto.github.io

- **Trello**  
  https://trello.com/invite/b/689c866294f05f35f777a3b5/ATTI82cd64ed81d8f7628fe4cc0e0723736f6E423B81/el-mejor-grupo

---

## 🎯 Objetivo del Proyecto

Servir datos al frontend y habilitar funcionalidades clave como:

- Autenticación de usuarios
- Manejo de carrito de compras
- Persistencia de datos en base de datos SQL

---

## 🗂️ Archivos Modificados

### 🌃 Backend (Node.js + Express.js)

Carpeta: `backend-mikan`

- `server/*.js` → Archivo principal del servidor  
- `routes/*.js` → Rutas de productos, carrito y login  
- `middleware/auth.js` → Middleware de autorización JWT  
- `data/*.json` → Datos de productos y usuarios  
- `ecommerce.sql` → Script de creación de la base de datos

---

### 🌁 Frontend

- `init.js` (configuración de rutas al servidor)
- `login.js`
- `nav.js`
- `myprofile.js`
- `product.js`
- `cart.js`
- `categories.js`
- `product-info.js`

---

## 🧩 Modelo Entidad–Relación (MER)

### Entidades principales

- **Usuario**  
  `id`, `username`, `nombre`, `apellido`, `password`

- **Producto**  
  `id`, `name`, `description`, `cost`, `currency`, `soldcount`, `categoryid`, `images`

- **Carrito**  
  `id`, `usuario_id`, `productid`, `quantity`

- **Calificación**  
  `id`, `id_product`, `id_user`, `puntuacion`, `comentario`, `fecha`

- **Categoría**  
  `id`, `name`, `description`, `productcount`, `imgsrc`

---

## 🔐 Endpoint POST `/login`

### 🎯 Objetivo
Autenticar usuarios y generar un token JWT.

### 🔎 Implementación técnica
- Recibe `{ usuario, contraseña }` en el body
- Valida credenciales contra JSON o base de datos
- Genera token JWT con `jsonwebtoken`
- Devuelve el token al frontend (localStorage o cookies)

---

## 🛒 Endpoint POST `/cart`

### 🎯 Objetivo
Guardar los ítems del carrito en la base de datos.

### 🔎 Implementación


- Recibe un array de productos:
  ```json
  { "id", "nombre", "cantidad", "precio" }
````
````
* Inserta o actualiza registros en `Carrito_Productos`
* Devuelve confirmación al frontend
* Actualiza el badge del carrito dinámicamente

---

## 🗄️ Implementación de Base de Datos (SQL)

### 🎯 Objetivo

Persistir usuarios y carrito de compras.

### 🔎 Implementación técnica

* Script `ecommerce.sql` con tablas:

  * Usuarios
  * Productos
  * Carrito
  * Orden
  * Carrito_Productos (N a N)
* Conexión configurada en `server.js`
* Datos de prueba incluidos

---

## ⚙️ Manual de Instalación

### 🔙 Backend (Node.js)

```bash
git clone https://github.com/Meewh/proyecto.github.io.git
cd proyecto.github.io/backend-mikan
node app.js
```

---

### 🌐 Frontend

```bash
git clone https://github.com/Meewh/proyecto.github.io.git
cd proyecto.github.io
```

Abrir con **Live Server** desde VS Code.

---

### 🐘 Base de Datos (PostgreSQL con Docker)

1. Instalar Docker Desktop
   [https://docs.docker.com/desktop/setup/install/windows-install/](https://docs.docker.com/desktop/setup/install/windows-install/)

2. Descargar imagen de PostgreSQL

3. Configurar contenedor:

   * Nombre: `Mikan`
   * Puerto: `5432`
   * Variables:

     * `POSTGRES_USER=mikan`
     * `POSTGRES_PASSWORD=mikan`
     * `POSTGRES_DB=mikan`

4. Iniciar contenedor

5. Instalar pgAdmin
   [https://www.pgadmin.org/download/pgadmin-4-windows/](https://www.pgadmin.org/download/pgadmin-4-windows/)

6. Crear conexión:

   * Host: `localhost`
   * Puerto: `5432`
   * DB: `mikan`
   * Usuario: `mikan`
   * Password: `mikan`

7. Ejecutar el contenido de `ecommerce.sql`

---

## 🧪 Pruebas con Postman

Colección lista para importar:
[https://drive.google.com/file/d/1AY4GkGWCZsl5jGN3y9jNjZPh_j_3AIx4/view?usp=sharing](https://drive.google.com/file/d/1AY4GkGWCZsl5jGN3y9jNjZPh_j_3AIx4/view?usp=sharing)

---

## 🚀 Estado del Proyecto

✔ Autenticación funcional
✔ Carrito persistente
✔ Backend y frontend integrados
✔ Base de datos operativa
