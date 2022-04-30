import { useSelector } from "react-redux";
import Loader from "../../components/Loader";
import Card from "./Card";
import Pagination from "./Pagination";
import FilterBar from "./FilterBar";
import { useEffect, useState } from "react";

const CardsContainer = ({ loading }) => {
  const state = useSelector((state) => state);
  const { dogsDB, dogsFound, dogsFiltered } = state;

  const dogsPerPage = 12;
  const [pages, setPages] = useState({
    totalPages: 0,
    pageShowed: 0,
    indexFirstDogShowed: 0,
    indexLastDogShowed: dogsPerPage,
  });
  const { pageShowed, indexFirstDogShowed, indexLastDogShowed } = pages;

  let dogs;

  dogsFound.length === 0 && dogsFiltered.length === 0
    ? (dogs = dogsDB)
    : dogsFiltered.length === 0
    ? (dogs = dogsFound)
    : (dogs = dogsFiltered);

  useEffect(() => {
    setPages({
      ...pages,
      pageShowed: 0,
      totalPages: Math.ceil(dogs.length / dogsPerPage),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dogs]);

  useEffect(() => {
    setPages({
      ...pages,
      indexFirstDogShowed: pageShowed * 12,
      indexLastDogShowed: dogsPerPage + pageShowed * 12,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageShowed]);

  return (
    <div>
      {loading ? (
        <Loader />
      ) : (
        <>
          <FilterBar />
          <div>
            {dogs && dogs[0] === null ? (
              <h1>NOOO</h1>
            ) : (
              dogs.map((dog, index) =>
                index >= indexFirstDogShowed && index < indexLastDogShowed ? (
                  <Card dogDetails={dog} key={dog.id} />
                ) : null
              )
            )}
          </div>
          <Pagination pages={pages} setPages={setPages} />
        </>
      )}
    </div>
  );
};

export default CardsContainer;
