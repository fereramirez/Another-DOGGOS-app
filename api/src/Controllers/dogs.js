require("dotenv").config();
const { Dog, Temperament } = require("../db");
const { v4: uuidv4 } = require("uuid");
const { default: axios } = require("axios");
const { API_URL, API_URL_NAME } = require("../../constants");
const { API_KEY } = process.env;
const { Op } = require("sequelize");

const getAllDogs = async (req, res, next) => {
  try {
    const { data: dogsApi } = await axios.get(`${API_URL}?api_key=${API_KEY}`);
    const dogsMyDb = await Dog.findAll();
    const allDogsResponse = await Promise.all([dogsApi, dogsMyDb]);
    const [dogsApiResponse, dogsMyDbResponse] = allDogsResponse;
    for (const dog of dogsApiResponse) {
      if (dog.weight.metric.includes("N")) dog.weight.metric = "15 - 20";
    }
    const allDogs = dogsApiResponse.concat(dogsMyDbResponse);
    return res.send(allDogs);
  } catch (err) {
    next(err);
  }
};

const getDogsQuery = async (req, res, next) => {
  const nameQuery = req.query.name;
  if (!nameQuery) res.send({ error: 400, message: "There is no 'name' query" });
  try {
    const { data: allDogsApi } = await axios.get(`${API_URL}`);
    const dogsFoundApi = allDogsApi.filter((dog) =>
      dog.name.toUpperCase().includes(nameQuery.toUpperCase())
    );
    const dogsFoundDb = await Dog.findAll({
      where: {
        name: {
          [Op.iLike]: `%${nameQuery}%`,
        },
      },
      /* include: [
        {
          model: Temperament,
          attributes: ["name"],
          through: { attributes: [] },
        },
      ], */
    });
    const allDogsResponse = await Promise.all([dogsFoundApi, dogsFoundDb]);
    const [dogsFoundApiResponse, dogsFoundDbResponse] = allDogsResponse;
    const allDogsFound = dogsFoundApiResponse.concat(dogsFoundDbResponse);
    allDogsFound.length > 0 ? res.send(allDogsFound) : res.send([null]);
    //res.send(allDogsFound);
  } catch (error) {
    next(error);
  }
};

const getDog = async (req, res, next) => {
  const idDog = req.params.idDog;
  if (!idDog)
    res.send({ error: 400, message: "There is no 'idDog' parameter" });
  try {
    let dogFound = null;
    if (idDog.includes("-")) {
      dogFound = await Dog.findOne({
        where: { id: idDog },
        /* include: [
          {
            model: Temperament,
            attributes: ["name"],
            through: { attributes: [] },
          },
        ], */
      });
    } else {
      const { data: allDogs } = await axios.get(
        `${API_URL}?api_key=${API_KEY}`
      );
      for (const dog of allDogs) {
        dog.id === parseInt(idDog) ? (dogFound = dog) : null;
      }
    }
    if (dogFound === null) res.send({ error: 404, message: "Dog not found" });
    const {
      name,
      weight,
      height,
      life_span,
      temperament,
      //temperaments,
      image,
      id,
    } = dogFound;
    res.send({
      name,
      weight,
      height,
      life_span,
      temperament,
      // temperaments,
      image,
      id,
    });
  } catch (error) {
    next(error);
  }
};

const createDog = async (req, res, next) => {
  if (!req.body) res.send({ error: 400, message: "The body is empty" });

  const newDog = {
    ...req.body,
    id: uuidv4(),
  };

  try {
    const createdDog = await Dog.create(newDog);
    /* let temperamentsPromises = [];
    for (let temperament of temperaments) {
      temperamentsPromises.push(
        Temperament.findOrCreate({
          where: {
            name: temperament,
          },
          defaults: {
            id: uuidv4(),
          },
        })
      );
    }
    const temperamentsResponse = await Promise.all(temperamentsPromises);
    let tempsToAdd = [];
    temperamentsResponse.forEach((el) => {
      tempsToAdd.push(el[0].dataValues.id);
    });
    await createdDog.addTemperament(tempsToAdd);
 */
    return res.send(createdDog);
  } catch (error) {
    next(error);
  }
};

const editDog = async (req, res, next) => {
  if (!req.body) res.send({ error: 400, message: "The body is empty" });
};

const deleteDog = async (req, res, next) => {
  const idDog = req.params.idDog;
  if (!idDog)
    res.send({ error: 400, message: "There is no 'idDog' parameter" });
  try {
    dogFound = await Dog.findOne({
      where: { id: idDog },
    });
    console.log(dogFound);
    if (!dogFound) res.send({ error: 400, message: "No dog to delete" });
    await dogFound.destroy();
    res.send("Eliminado");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllDogs,
  getDogsQuery,
  getDog,
  createDog,
  editDog,
  deleteDog,
};
