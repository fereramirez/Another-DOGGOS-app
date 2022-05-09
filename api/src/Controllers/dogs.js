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
    return res.status(200).send(allDogs);
  } catch (err) {
    let error = {};
    if (err.response) {
      error.message = err.message;
      error.status = err.response.status;
    } else if (err.request) {
      error.message = "Server does not respond";
      error.status = 504;
    } else {
      error.message = "Error " + err.message;
    }
    next(error);
  }
};

const getDogsQuery = async (req, res, next) => {
  const nameQuery = req.query.name;
  if (!nameQuery) return res.status(400).send("There is no 'name' query");
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
    allDogsFound.length > 0
      ? res.status(200).send(allDogsFound)
      : res.status(200).send([null]);
    //res.send(allDogsFound);
  } catch (err) {
    let error = {};
    if (err.response) {
      error.message = err.message;
      error.status = err.response.status;
    } else if (err.request) {
      error.message = "Server does not respond";
      error.status = 504;
    } else {
      error.message = "Error " + err.message;
    }
    next(error);
  }
};

const getDog = async (req, res, next) => {
  const idDog = req.params.idDog;
  if (!idDog) return res.status(400).send("There is no 'idDog' parameter");
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
    if (!dogFound) return res.status(404).send("Dog not found");
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
    return res.status(200).send({
      name,
      weight,
      height,
      life_span,
      temperament,
      // temperaments,
      image,
      id,
    });
  } catch (err) {
    let error = {};
    if (err.response) {
      error.message = err.message;
      error.status = err.response.status;
    } else if (err.request) {
      error.message = "Server does not respond";
      error.status = 504;
    } else {
      error.message = "Error " + err.message;
    }
    next(error);
  }
};

const createDog = async (req, res, next) => {
  if (!req.body) return res.status(400).send("The body is empty");

  const newDog = {
    ...req.body,
    id: uuidv4(),
  };

  const { data: dogsApi } = await axios.get(`${API_URL}?api_key=${API_KEY}`);
  const dogsMyDb = await Dog.findAll();
  const allDogsResponse = await Promise.all([dogsApi, dogsMyDb]);
  const [dogsApiResponse, dogsMyDbResponse] = allDogsResponse;
  const allDogs = dogsApiResponse.concat(dogsMyDbResponse);

  for (const dog of allDogs) {
    if (dog.name.toUpperCase() === newDog.name.toUpperCase()) {
      return res.status(400).send("The breed already exists");
    }
  }

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
    return res.status(201).send(createdDog);
  } catch (error) {
    next(error);
  }
};

const editDog = async (req, res, next) => {
  const idDog = req.params.idDog;
  if (!idDog) return res.status(400).send("There is no 'idDog' parameter");
  if (!req.body) return res.status(400).send("The body is empty");
  const editedDog = req.body;

  const { data: dogsApi } = await axios.get(`${API_URL}?api_key=${API_KEY}`);
  const dogsMyDb = await Dog.findAll();
  const allDogsResponse = await Promise.all([dogsApi, dogsMyDb]);
  const [dogsApiResponse, dogsMyDbResponse] = allDogsResponse;
  const allDogs = dogsApiResponse.concat(dogsMyDbResponse);

  if (editedDog.name) {
    for (const dog of allDogs) {
      if (dog.name.toUpperCase() === editedDog.name.toUpperCase()) {
        return res.status(400).send("The breed already exists");
      }
    }
  }

  try {
    dogFound = await Dog.findOne({
      where: { id: idDog },
    });
    if (!dogFound) return res.status(404).send("Dog not found");
    const response = await dogFound.update(editedDog);
    return res.status(201).send(response);
  } catch (error) {
    next(error);
  }
};

const deleteDog = async (req, res, next) => {
  const idDog = req.params.idDog;
  if (!idDog) return res.status(400).send("There is no 'idDog' parameter");
  try {
    dogFound = await Dog.findOne({
      where: { id: idDog },
    });
    if (!dogFound) return res.status(404).send("Dog not found");
    await dogFound.destroy();
    return res.status(200).send("Deleted");
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
