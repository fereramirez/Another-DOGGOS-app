const { Router } = require("express");

const {
  getAllDogs,
  getDogsQuery,
  getDog,
  createDog,
  editDog,
  deleteDog,
} = require("../Controllers/dogs");

const router = Router();

router.get("/", getAllDogs);

router.get("/search", getDogsQuery);

router.get("/:idRaza", getDog);

router.post("/", createDog);

module.exports = router;
