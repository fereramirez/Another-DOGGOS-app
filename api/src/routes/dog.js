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

router.get("/:idDog", getDog);

router.post("/", createDog);

router.delete("/:idDog", deleteDog);

router.put("/:idDog", editDog);

module.exports = router;
