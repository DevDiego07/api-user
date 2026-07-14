const express = require('express');
const { getUsers, getUserById, updateUser, deleteUser } = require('../controllers/user.controller');
const { verifyToken, verifyRole } = require('../middlewares/auth.middleware');

const router = express.Router();

router.get('/', verifyToken, verifyRole(['admin', 'user']), getUsers);
router.get('/:id', verifyToken, verifyRole(['admin', 'user']), getUserById);
router.put('/:id', verifyToken, verifyRole(['admin', 'user']), updateUser);
router.delete('/:id', verifyToken, verifyRole(['admin']), deleteUser);

module.exports = router;
