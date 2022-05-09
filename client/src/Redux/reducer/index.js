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
} from "../actions/index.js";

const initialState = {
  dogsAll: [],
  dogsFound: [],
  dogsFiltered: [],
  dogsShowed: [],
  dogDetails: {},
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
      return {
        ...state,
        dogsAll: state.dogsAll.map((dog) =>
          dog.id === action.payload.id ? action.payload : dog
        ),
      };

    case DELETE_DOG:
      return {
        ...state,
        dogsAll: state.dogsAll.filter((dog) => dog.id !== action.payload),
      };

    case FILTER_DOGS:
      state.dogsFound.length === 0 ? (dogs = "dogsAll") : (dogs = "dogsFound");
      let dogsAfterFilter;

      if (
        !action.payload.temperament &&
        action.payload.own === true &&
        action.payload.api === true
      ) {
        return {
          ...state,
          dogsFiltered: [],
        };
      }

      if (action.payload.own === true && action.payload.api === false) {
        dogsAfterFilter = state[dogs].filter(
          (dog) => dog.id && typeof dog.id !== "number"
        );
      } else if (action.payload.own === false && action.payload.api === true) {
        dogsAfterFilter = state[dogs].filter(
          (dog) => dog.id && typeof dog.id === "number"
        );
      } else if (action.payload.own === true && action.payload.api === true) {
        dogsAfterFilter = state[dogs];
      } else if (action.payload.own === false && action.payload.api === false) {
        return {
          ...state,
          dogsFiltered: [null],
        };
      }

      if (action.payload.temperament) {
        dogsAfterFilter = dogsAfterFilter.filter(
          (dog) =>
            dog.temperament &&
            dog.temperament
              .toUpperCase()
              .includes(action.payload.temperament.toUpperCase())
        );
      }

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
            dogA = parseInt(a.weight.metric.split(" ")[0]);
            dogB = parseInt(b.weight.metric.split(" ")[0]);
            if (action.payload.asc === "asc") {
              return dogA - dogB;
            } else {
              return dogB - dogA;
            }
          }
        }),
      };

    default:
      return state;
  }
}
