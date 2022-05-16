const { Router } = require("express");
const DogRoutes = require("./dog");
const TemperamentRoutes = require("./temperament");

const router = Router();

router.use("/dog", DogRoutes);
router.use("/temperament", TemperamentRoutes);

module.exports = router;
