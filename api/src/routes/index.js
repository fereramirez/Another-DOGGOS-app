const { Router } = require("express");
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');
const DogRoutes = require("./dog");
const TemperamentRoutes = require("./temperament");

const router = Router();

// Configurar los routers

router.use("/dog", DogRoutes);
router.use("/temperament", TemperamentRoutes);

module.exports = router;
