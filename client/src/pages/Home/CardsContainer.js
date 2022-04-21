import { useSelector } from "react-redux";
import Loader from "../../components/Loader";
import Card from "./Card";
import Pagination from "./Pagination";
import FilterBar from "./FilterBar";

const CardsContainer = ({ loading }) => {
  const state = useSelector((state) => state);
  const { dogsDB, dogsFound, dogsFiltered } = state;

  let dogs;

  dogsFound.length === 0 && dogsFiltered.length === 0
    ? (dogs = dogsDB)
    : dogsFiltered.length === 0
    ? (dogs = dogsFound)
    : (dogs = dogsFiltered);

  //!FACU ¿es mala practica dejar la asignacion de arriba fuera de un useEffect?

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <>
          <FilterBar />
          <div>
            {dogs.map((dog) => (
              <Card dogDetails={dog} key={dog.id} />
            ))}
          </div>
          <Pagination />
        </>
      )}
    </div>
  );
};

export default CardsContainer;
