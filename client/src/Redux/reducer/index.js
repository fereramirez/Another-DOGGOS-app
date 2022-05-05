import {
  GET_ALL_DOGS,
  SHOW_DOGS,
  GET_DOG,
  SEARCH_DOGS,
  CREATE_DOG,
  EDIT_DOG,
  DELETE_DOG,
  FILTER_DOGS,
  ORDER_DOGS,
  NO_DOGS,
} from "../actions/index.js";

const initialState = {
  dogsAll: [],
  dogsFound: [],
  dogsFiltered: [],
  dogsShowed: [],
  dogDetails: [],
};

export default function rootReducer(state = initialState, action) {
  let dogs;
  switch (action.type) {
    case GET_ALL_DOGS:
      return {
        ...state,
        dogsAll: action.payload.map((data) => data),
      };

    case SHOW_DOGS:
      state.dogsFound.length === 0 && state.dogsFiltered.length === 0
        ? (dogs = "dogsAll")
        : state.dogsFiltered.length === 0
        ? (dogs = "dogsFound")
        : (dogs = "dogsFiltered");
      return {
        ...state,
        dogsShowed: state[dogs].slice(
          action.payload.indexFirstDogShowed,
          action.payload.indexLastDogShowed
        ),
      };

    case GET_DOG:
      return {
        ...state,
        dogDetails: action.payload,
      };

    case SEARCH_DOGS:
      return {
        ...state,
        dogsFiltered: [],
        dogsFound: action.payload.map((data) => data),
      };

    case CREATE_DOG:
      return {
        ...state,
        dogsAll: [...state.dogsAll, action.payload],
      };

    case EDIT_DOG:
      let newData = state.dogsAll.map((dog) =>
        dog.id === action.payload.id ? action.payload : dog
      );
      return {
        ...state,
        dogDB: newData,
      };

    case DELETE_DOG:
      return state.dogsAll.filter((dog) => dog.id !== action.payload);

    case FILTER_DOGS:
      state.dogsFound.length === 0 ? (dogs = "dogsAll") : (dogs = "dogsFound");

      if (action.payload.temperament) {
        let dogsAfterFilter = state[dogs].filter(
          (dog) =>
            dog.temperament &&
            dog.temperament
              .toUpperCase()
              .includes(action.payload.temperament.toUpperCase())
        );
        if (dogsAfterFilter.length) {
          return {
            ...state,
            dogsFiltered: dogsAfterFilter,
          };
        } else {
          return {
            ...state,
            dogsFiltered: [null],
          };
        }
      } else {
        return {
          ...state,
          dogsFiltered: [],
        };
      }

    case ORDER_DOGS:
      let dogA, dogB;

      state.dogsFound.length === 0 && state.dogsFiltered.length === 0
        ? (dogs = "dogsAll")
        : state.dogsFiltered.length === 0
        ? (dogs = "dogsFound")
        : (dogs = "dogsFiltered");
      /*
      payload: {
        by: 'name' || 'weight'
        asc: 'asc' || 'desc'
      }
*/
      return {
        ...state,
        [dogs]: state[dogs].sort((a, b) => {
          if (action.payload.by === "name") {
            dogA = a[action.payload.by].toUpperCase();
            dogB = b[action.payload.by].toUpperCase();
            if (action.payload.asc === "asc") {
              return dogA < dogB ? -1 : dogA > dogB ? 1 : 0;
            } else {
              return dogA > dogB ? -1 : dogA < dogB ? 1 : 0;
            }
          } else {
            dogA = parseInt(a.weight.imperial.split(" ")[0]);
            dogB = parseInt(b.weight.imperial.split(" ")[0]);
            if (action.payload.asc === "asc") {
              return dogA - dogB;
            } else {
              return dogB - dogA;
            }
          }
        }),
      };

    case NO_DOGS:
      return initialState;

    default:
      return state;
  }
}
