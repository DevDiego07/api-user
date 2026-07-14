const { pool, poolConnect, sql } = require('../config/database');

const findUserByEmail = async (email) => {
    await poolConnect;
    const result = await pool.request()
        .input('email', sql.NVarChar, email)
        .query('SELECT id, name, email, password, role, created_at FROM Users WHERE email = @email');
    return result.recordset[0];
};


const createUser = async (name, email, hashedPassword, role = 'user') => {
    await poolConnect;
    const result = await pool.request()
        .input('name', sql.NVarChar, name)
        .input('email', sql.NVarChar, email)
        .input('password', sql.VarChar, hashedPassword)
        .input('role', sql.VarChar, role)
        .query('INSERT INTO Users (name, email, password, role) OUTPUT INSERTED.id, INSERTED.name, INSERTED.email, INSERTED.role, INSERTED.created_at VALUES (@name, @email, @password, @role)');
    return result.recordset[0];
};

const saveRefreshToken = async (userId, token, expiresAt) => {
    await poolConnect;
    await pool.request()
        .input('user_id', sql.Int, userId)
        .input('token', sql.VarChar, token)
        .input('expires_at', sql.DateTime, expiresAt)
        .query('INSERT INTO RefreshTokens (user_id, token, expires_at) VALUES (@user_id, @token, @expires_at)');
};

const findRefreshToken = async (token) => {
    await poolConnect;
    const result = await pool.request()
        .input('token', sql.VarChar, token)
        .query('SELECT * FROM RefreshTokens WHERE token = @token');
    return result.recordset[0];
};

const deleteRefreshToken = async (token) => {
    await poolConnect;
    await pool.request()
        .input('token', sql.VarChar, token)
        .query('DELETE FROM RefreshTokens WHERE token = @token');
};

module.exports = {
    findUserByEmail,
    createUser,
    saveRefreshToken,
    findRefreshToken,
    deleteRefreshToken,
 };