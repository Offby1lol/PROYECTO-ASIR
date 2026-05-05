//Importación de módulos necesarios
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const client = require('prom-client'); //Prometheus para métricas
const jwt = require('jsonwebtoken');//Autenticación con tokens
//Inicialización de la app Express
const app = express();
const port = 3000;
const JWT_SECRET = process.env.JWT_SECRET;//Secreto para firmar tokens
//Middlewares globales
app.use(cors());        //Habilita CORS
app.use(express.json());//Habilita lectura de JSON en las peticiones
//Conexión con la base de datos MySQL
const pool = mysql.createPool({
  host: 'mysql',
  user: 'root',
  password: process.env.MYSQL_ROOT_PASSWORD,
  database: 'plataforma_ventas'
});

// Configuración de métricas con Prometheus
const register = client.register;
client.collectDefaultMetrics({ register });

const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Número total de peticiones al backend',
});

const httpErrorCounter = new client.Counter({
  name: 'http_requests_errors_total',
  help: 'Número total de errores 500',
});

const routeCounter = new client.Counter({
  name: 'http_requests_by_route_total',
  help: 'Número de peticiones por ruta',
  labelNames: ['route']
});

const productoTotalGauge = new client.Gauge({
  name: 'nodejs_custom_product_count',
  help: 'Número total de productos en la base de datos'
});

// Middleware para verificar el token JWT
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Token requerido' });

  const token = authHeader.split(' ')[1];
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido' });
    req.user = user;
    next();
  });
}

//Usuarios definidos manualmente
const ADMIN_EMAIL = 'admin@demo.com';
const ADMIN_PASSWORD = 'demo1234';

const USER_EMAIL = 'user@demo.com';
const USER_PASSWORD = 'demo1234';
//Ruta de inicio de sesión
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '2h' });
    return res.json({ token });
  }

  if (email === USER_EMAIL && password === USER_PASSWORD) {
    const token = jwt.sign({ role: 'user' }, JWT_SECRET, { expiresIn: '2h' });
    return res.json({ token });
  }

  return res.status(401).json({ error: 'Credenciales incorrectas' });
});
//Ruta para consultar métricas prometheus
app.get('/metrics', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT COUNT(*) AS total FROM productos');
    productoTotalGauge.set(rows[0].total);

    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (err) {
    res.status(500).end(err.message);
  }
});
//Obtener todos los productos
app.get('/productos', async (req, res) => {
  httpRequestCounter.inc();
  routeCounter.inc({ route: '/productos' });

  try {
    const [rows] = await pool.query('SELECT * FROM productos');
    res.json({ data: rows });
  } catch (err) {
    httpErrorCounter.inc();
    res.status(500).json({ error: err.message });
  }
});
//Añadir nuevo producto (solo para admins)
app.post('/productos', authMiddleware, async (req, res) => {
  httpRequestCounter.inc();
  routeCounter.inc({ route: '/productos' });

  const { nombre, descripcion, precio, stock } = req.body;

  // Validación de campos
  if (
    !nombre || typeof nombre !== 'string' || nombre.trim().length < 2 ||
    !descripcion || typeof descripcion !== 'string' || descripcion.trim().length < 5 ||
    isNaN(precio) || parseFloat(precio) <= 0 ||
    isNaN(stock) || parseInt(stock) < 0
  ) {
    return res.status(400).json({
      error: 'Datos inválidos. Asegúrate de que: nombre (min 2), descripción (min 5), precio (>0), stock (>=0).'
    });
  }

  try {
    const [result] = await pool.query(
      'INSERT INTO productos (nombre, descripcion, precio, stock) VALUES (?, ?, ?, ?)',
      [nombre, descripcion, parseFloat(precio), parseInt(stock)]
    );

    res.status(201).json({
      id: result.insertId,
      nombre,
      descripcion,
      precio: parseFloat(precio),
      stock: parseInt(stock)
    });
  } catch (err) {
    httpErrorCounter.inc();
    res.status(500).json({ error: err.message });
  }
});

//Eliminar un producto por ID
app.delete('/productos/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.query('DELETE FROM productos WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      res.status(404).json({ error: 'Producto no encontrado.' });
    } else {
      res.status(200).json({ message: 'Producto eliminado.' });
    }
  } catch (err) {
    httpErrorCounter.inc();
    res.status(500).json({ error: err.message });
  }
});
//Eliminar todos los productos
app.delete('/productos', authMiddleware, async (req, res) => {
  try {
    await pool.query('DELETE FROM productos');
    res.status(200).json({ message: 'Todos los productos eliminados.' });
  } catch (err) {
    httpErrorCounter.inc();
    res.status(500).json({ error: err.message });
  }
});
//Inicio del servidor
app.listen(port, () => {
  console.log(`Servidor en http://localhost:${port}`);
});

//editar un producto ya introducido
app.put('/productos/:id', authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio, stock } = req.body;

  if (
    !nombre || typeof nombre !== 'string' || nombre.trim().length < 2 ||
    !descripcion || typeof descripcion !== 'string' || descripcion.trim().length < 5 ||
    isNaN(precio) || parseFloat(precio) <= 0 ||
    isNaN(stock) || parseInt(stock) < 0
  ) {
    return res.status(400).json({
      error: 'Datos inválidos. Asegúrate de que: nombre (min 2), descripción (min 5), precio (>0), stock (>=0).'
    });
  }

  try {
    const [result] = await pool.query(
      'UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, stock = ? WHERE id = ?',
      [nombre, descripcion, parseFloat(precio), parseInt(stock), id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.status(200).json({ message: 'Producto actualizado correctamente' });
  } catch (err) {
    httpErrorCounter.inc();
    res.status(500).json({ error: err.message });
  }
});

