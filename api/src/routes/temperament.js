const { Router } = require("express");
const { getAllTemperaments } = require("../Controllers/temperaments");

const router = Router();

router.get("/", getAllTemperaments);

module.exports = router;
