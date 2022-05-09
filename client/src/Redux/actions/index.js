export const GET_ALL_DOGS = "GET_ALL_DOGS";
export const SHOW_DOGS = "SHOW_DOGS";
export const GET_DOG = "GET_DOG";
export const SEARCH_DOGS = "SEARCH_DOGS";
export const CREATE_DOG = "CREATE_DOG";
export const EDIT_DOG = "EDIT_DOG";
export const DELETE_DOG = "DELETE_DOG";
export const FILTER_DOGS = "FILTER_DOGS";
export const ORDER_DOGS = "ORDER_DOGS";

export const getAllDogs = (dogs) => {
  return {
    type: GET_ALL_DOGS,
    payload: dogs,
  };
};

export const showDogs = (index) => {
  return {
    type: SHOW_DOGS,
    payload: index,
  };
};

export const getDog = (dog) => {
  return {
    type: GET_DOG,
    payload: dog,
  };
};

export const searchDogs = (dogs) => {
  return {
    type: SEARCH_DOGS,
    payload: dogs,
  };
};

export const createDog = (dogData) => {
  return {
    type: CREATE_DOG,
    payload: dogData,
  };
};

export const editDog = (dogData) => {
  return {
    type: EDIT_DOG,
    payload: dogData,
  };
};

export const deleteDog = (id) => {
  return {
    type: DELETE_DOG,
    payload: id,
  };
};

export const filterDogs = (filter) => {
  return {
    type: FILTER_DOGS,
    payload: filter,
  };
};

export const orderDogs = (order) => {
  return {
    type: ORDER_DOGS,
    payload: order,
  };
};
