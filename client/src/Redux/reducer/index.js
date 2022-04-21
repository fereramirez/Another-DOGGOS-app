import {
  GET_ALL_DOGS,
  SEARCH_DOGS,
  CREATE_DOG,
  EDIT_DOG,
  DELETE_DOG,
  FILTER_DOGS,
  ORDER_DOGS,
  NO_DOGS,
} from "../actions/index.js";

const initialState = {
  dogsDB: [],
  dogsFound: [],
  dogsFiltered: [],
};

export default function rootReducer(state = initialState, action) {
  let dogs;
  switch (action.type) {
    case GET_ALL_DOGS:
      return {
        ...state,
        dogsDB: action.payload.map((data) => data),
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
        dogsDB: [...state.dogsDB, action.payload],
      };

    case EDIT_DOG:
      let newData = state.dogsDB.map((dog) =>
        dog.id === action.payload.id ? action.payload : dog
      );
      return {
        ...state,
        dogDB: newData,
      };

    case DELETE_DOG:
      return state.dogsDB.filter((dog) => dog.id !== action.payload);

    case FILTER_DOGS:
      state.dogsFound.length === 0 ? (dogs = "dogsDB") : (dogs = "dogsFound");

      if (action.payload) {
        return {
          ...state,
          dogsFiltered: state[dogs].filter(
            (dog) => dog.temperament && dog.temperament.includes(action.payload)
          ),
        };
      } else {
        return {
          ...state,
          dogsFiltered: [],
        };
      }

    case ORDER_DOGS:
      let dogA, dogB;

      state.dogsFound.length === 0 && state.dogsFiltered.length === 0
        ? (dogs = "dogsDB")
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

// reducer;
