const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { findUserByEmail, 
        createUser, 
        saveRefreshToken,
        findRefreshToken,
        deleteRefreshToken
 } = require('../models/user.model');

// Registra un usuario nuevo
const register = async (name, email, password) => { 
    // Verificamos si ya existe un usuario con ese email
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
        throw new Error('El email ya esta registrado');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await createUser(name, email, hashedPassword);
    return newUser;
};

const generateAccestToken  = (userId, role) => {
    return jwt.sign(
        { userId, role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
};

const generateRefreshToken   = (userId) => {
    return jwt.sign(
        { userId },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN }
    );
};

const login = async (email, password) => {
    const user = await findUserByEmail(email);

    if(!user){
        throw new Error('Credenciales invalidas')
    }


    const passwordMatch = await bcrypt.compare(password, user.password);
    if(!passwordMatch){
        throw new Error('Credenciales invalidas');
    }

    const accessToken = generateAccestToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);

    // Calculamos la fecha de expiracion del refresh token
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await saveRefreshToken(user.id, refreshToken, expiresAt);


    return {
        accessToken,
        refreshToken,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    };
};


const refresh = async (token) => {
    const savedToken = await findRefreshToken(token);
    if(!savedToken){
        throw new Error('Refresh token invalido');
        
    }

    // Verificamos que el token no haya expirado
    if (new Date() > new Date(savedToken.expires_at)) {
        await deleteRefreshToken(token);
        throw new Error('Refresh token expirado');
    }

    // Verificamos la firma del token con jwt
    const payload = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

    // Generamos un nuevo access token
    const accessToken = generateAccestToken(payload.userId, payload.role);

    return { accessToken };
};

const logout = async (token) => {
    await deleteRefreshToken(token);
};



module.exports = { register, login, refresh, logout };