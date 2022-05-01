require("dotenv").config();
const { Temperament } = require("../db");
const { v4: uuidv4 } = require("uuid");
const { default: axios } = require("axios");
const { API_URL, API_URL_NAME } = require("../../constants");
const { API_KEY } = process.env;

const getAllTemperaments = async (req, res, next) => {
  let allTemperaments = [];
  try {
    const { data: dogsApi } = await axios.get(`${API_URL}?api_key=${API_KEY}`);
    for (const dog of dogsApi) {
      dog.temperament &&
        (dogTemperaments = dog.temperament.replace(/,/g, "").split(" "));
      for (const temperament of dogTemperaments) {
        allTemperaments.includes(temperament) ||
          allTemperaments.push(temperament);
      }
    }
    allTemperaments.sort();
    allTemperaments.unshift(null);
    res.send(allTemperaments);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllTemperaments,
};
