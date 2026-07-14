const { register, login, refresh, logout } = require('../services/auth.service');

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                status: 'error',
                message: 'Todos los campos son obligatorios'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                status: 'error',
                message: 'La password debe tener minimo 6 caracteres'
            });
        }

        const newUser = await register(name, email, password);

        res.status(201).json({
            status: 'ok',
            message: 'Usuario registrado correctamente',
            data: newUser
        });

    } catch (err) {
        if (err.message === 'El email ya esta registrado') {
            return res.status(409).json({
                status: 'error',
                message: err.message
            });
        }

        res.status(500).json({
            status: 'error',
            message:  err.message //'Error interno del servidor'
        });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if(!email || !password){
            return res.status(400).json({
                status: 'error',
                message: 'Email y Password son obligatorios'
            });
        }

        const result = await login(email,password);

        res.status(200).json({
            status: 'ok',
            message: 'Login correcto',
            data: result
        });


    } catch (err) {
        if(err.message === 'Credenciales invalidas'){
            return res.status(401).json({
                status: 'error',
                message: err.message
            });
        }

        res.status(500).json({
            status: 'error',
            message: err.message
        });

    }
};

const refreshToken = async (req, res) => {
    try {
        const { token } = req.body;

        if(!token){
            return res.status(400).json({
                status: 'error',
                message: 'Token es obligatorio'
            });
        }

        const result = await refresh(token);

        res.status(200).json({
            status: 'ok',
            message: 'Token renovado correctamente',
            data: result
        });
    } catch (err) {
        if (err.message === 'Refresh token invalido' || err.message === 'Refresh token expirado'){
            return res.status(401).json({
                status: 'error',
                message: err.message
            });
        }

        res.status(500).json({
            status: 'error',
            message: err.message
        });
    }
};

const logoutUser = async (req, res) => {
    try {
        const { token } = req.body;

        if(!token){
            return res.status(400).json({
                status: 'error',
                message: 'Token es obligatorio'
            });
        }

        await logout(token);

        res.status(200).json({
            status: 'ok',
            message: 'Secion cerrada correctamente'
        });
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message
        });
    }
};

module.exports = { registerUser, loginUser, refreshToken, logoutUser };