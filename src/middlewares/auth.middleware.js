const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({
      status: "error",
      mesage: "Token no proporcionado",
    });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      status: "error",
      mesage: "Formateo de token invalido",
    });
  }

  try {
    const playload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = playload;
    next();
  } catch (err) {
    return res.status(401).json({
      status: "error",
      mesage: "Token invalido o expirado",
    });
  }
};

const verifyRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: "error",
        mesage: "No autenticado",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: "error",
        mesage: "No tienes permiso para realizar esta accion",
      });
    }
    next();
  };
};

module.exports = { verifyToken, verifyRole };
