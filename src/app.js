const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRouters = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');

const app = express();

app.use(express.json());
app.use(cors());

app.use('/auth', authRouters);
app.use('/users', userRoutes);


app.get('/health', (req, res) => {
    res.json({status: 'ok', message: 'Servidor corriendo correctamente'});
});

module.exports = app;