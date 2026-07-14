const sql = require('mssql');
require('dotenv').config();

// Configuracion de la conexion a SQL Server
const dbConfig = {
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT),
    options: {
        encrypt: false,          
        trustServerCertificate: true  
    }
};

const pool = new sql.ConnectionPool(dbConfig);
const poolConnect = pool.connect();

pool.on('error', (err) => {
    console.error('Error en el pool de conexiones:', err);
});

module.exports = { pool, poolConnect, sql };