const { response } = require("express");

const esAdmin = (req, res = response, next) => {
  if (!req.user)
    return res.status(500).send("Se intenta acceder sin verificar el token");

  const { role, name } = req.user;

  if (role !== "ADMIN_ROLE")
    return res.status(401).send("Usuario sin permisos de administrador");

  next();
};

const tieneRole = (...roles) => {
  return (req, res, next) => {
    if (!req.user)
      return res.status(500).send("Se intenta acceder sin verificar el token");

    if (!roles.includes(req.user.role))
      return res.status(401).json({
        msg: "El rol del usuario no le permite realizar esta acción",
      });
    next();
  };
};

module.exports = { esAdmin, tieneRole };
