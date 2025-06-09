const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'mysql',
  user: process.env.DB_USER || 'appuser',
  password: process.env.DB_PASSWORD || 'userpass',
  database: process.env.DB_NAME || 'plataforma_ventas',
  waitForConnections: true,
  connectionLimit: 10,
  connectTimeout: 10000
});

// Test de conexión al iniciar
pool.getConnection()
  .then(conn => {
    console.log('✅ Conexión a MySQL exitosa!');
    conn.release();
  })
  .catch(err => {
    console.error('❌ Error de conexión:', err.message);
    process.exit(1);
  });

module.exports = pool;