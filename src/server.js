const app = require('./app');
const { pool, poolConnect } = require('./config/database');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await poolConnect;
        console.log('Conexion a SQL Server establecida correctamente');

        app.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`);
        });

    } catch (err) {
        console.error('Error al conectar con SQL Server:', err);
        process.exit(1);
    }
};

startServer();