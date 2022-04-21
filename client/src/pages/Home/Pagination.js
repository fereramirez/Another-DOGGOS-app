import { useSelector } from "react-redux";

const Pagination = () => {
  const state = useSelector((state) => state);
  const { dogsDB, dogsFound, dogsFiltered } = state;

  let dogs;

  dogsFound.length === 0 && dogsFiltered.length === 0
    ? (dogs = dogsDB)
    : state.dogsFiltered.length === 0
    ? (dogs = dogsFound)
    : (dogs = dogsFiltered);

  return (
    <>
      <h1>PAGE NUMBERS</h1>
    </>
  );
};

export default Pagination;
