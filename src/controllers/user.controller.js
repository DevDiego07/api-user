const { pool, poolConnect, sql } = require('../config/database');

const getUsers = async (req, res) => {
    try {
        await poolConnect;
        const result = await pool.request()
            .query('SELECT id, name, email, role, created_at FROM Users');

        res.status(200).json({
            status: 'ok',
            data: result.recordset
        });

    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message
        });
    }
};

const getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        await poolConnect;
        const result = await pool.request()
            .input('id', sql.Int, parseInt(id))
            .query('SELECT id, name, email, role, created_at FROM Users WHERE id = @id');

        if (!result.recordset[0]) {
            return res.status(404).json({
                status: 'error',
                message: 'Usuario no encontrado'
            });
        }

        res.status(200).json({
            status: 'ok',
            data: result.recordset[0]
        });

    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message
        });
    }
};

const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email } = req.body;

        if (!name && !email) {
            return res.status(400).json({
                status: 'error',
                message: 'Debes proporcionar al menos un campo para actualizar'
            });
        }

        await poolConnect;

        const userExists = await pool.request()
            .input('id', sql.Int, parseInt(id))
            .query('SELECT id FROM Users WHERE id = @id');

        if (!userExists.recordset[0]) {
            return res.status(404).json({
                status: 'error',
                message: 'Usuario no encontrado'
            });
        }

        let query = 'UPDATE Users SET ';
        const request = pool.request();
        const fields = [];

        if (name) {
            fields.push('name = @name');
            request.input('name', sql.NVarChar, name);
        }

        if (email) {
            fields.push('email = @email');
            request.input('email', sql.NVarChar, email);
        }

        query += fields.join(', ');
        query += ' WHERE id = @id';
        request.input('id', sql.Int, parseInt(id));

        await request.query(query);

        res.status(200).json({
            status: 'ok',
            message: 'Usuario actualizado correctamente'
        });

    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message
        });
    }
};

const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        await poolConnect;

        const userExists = await pool.request()
            .input('id', sql.Int, parseInt(id))
            .query('SELECT id FROM Users WHERE id = @id');

        if (!userExists.recordset[0]) {
            return res.status(404).json({
                status: 'error',
                message: 'Usuario no encontrado'
            });
        }

        await pool.request()
            .input('id', sql.Int, parseInt(id))
            .query('DELETE FROM Users WHERE id = @id');

        res.status(200).json({
            status: 'ok',
            message: 'Usuario eliminado correctamente'
        });

    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message
        });
    }
};

module.exports = { getUsers, getUserById, updateUser, deleteUser };