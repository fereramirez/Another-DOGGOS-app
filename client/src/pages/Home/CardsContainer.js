import { useSelector } from "react-redux";
import Card from "./Card";
import Pagination from "./Pagination";
import FilterBar from "./FilterBar";
import { useEffect, useRef, useState } from "react";
import Loader from "../../components/Loader";

const CardsContainer = ({ loading }) => {
  const state = useSelector((state) => state);
  const { dogsAll, dogsFound, dogsFiltered } = state;
  let dogs = useRef();

  const dogsPerPage = 12;
  const initialPages = {
    totalPages: 0,
    pageShowed: 0,
    indexFirstDogShowed: 0,
    indexLastDogShowed: dogsPerPage,
  };
  const [pages, setPages] = useState(initialPages);
  const { pageShowed, indexFirstDogShowed, indexLastDogShowed } = pages;

  dogsFound.length === 0 && dogsFiltered.length === 0
    ? (dogs.current = dogsAll)
    : dogsFiltered.length === 0
    ? (dogs.current = dogsFound)
    : (dogs.current = dogsFiltered);

  useEffect(() => {
    dogs.current = sessionStorage.getItem("dogsToShowData") || dogs.current;

    window.onunload = function () {
      sessionStorage.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    sessionStorage.setItem("dogsToShowData", dogs.current);

    setPages({
      ...pages,
      pageShowed: 0,
      totalPages: Math.ceil(dogs.current.length / dogsPerPage),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dogs.current]);

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
          {dogs.current &&
          dogs.current !== dogsFiltered &&
          dogs.current[0] === null ? (
            <h1>No dogs found</h1>
          ) : (
            <>
              <FilterBar />
              <div>
                {dogs.current && dogs.current[0] === null ? (
                  <h1>No coincidences found</h1>
                ) : (
                  dogs.current.map((dog, index) =>
                    index >= indexFirstDogShowed &&
                    index < indexLastDogShowed ? (
                      <Card dogDetails={dog} key={dog.id} />
                    ) : null
                  )
                )}
              </div>
              <Pagination pages={pages} setPages={setPages} />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default CardsContainer;
