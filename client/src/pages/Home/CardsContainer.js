import { useDispatch, useSelector } from "react-redux";
import Card from "./Card";
import Pagination from "./Pagination";
import FilterBar from "./FilterBar";
import { useEffect, useRef, useState } from "react";
import Loader from "../../components/Loader";
import { showDogs } from "../../Redux/actions";
import { dogsPerPage } from "../../Constants";
import "./CardsContainer.css";

const CardsContainer = () => {
  const state = useSelector((state) => state);
  const { dogsAll, dogsFound, dogsFiltered, dogsShowed, isItLoading } = state;
  const dispatch = useDispatch();
  //const topCardsRef = useRef(null);
  let dogs;
  dogsFound.length === 0 && dogsFiltered.length === 0
    ? (dogs = dogsAll)
    : dogsFiltered.length === 0
    ? (dogs = dogsFound)
    : (dogs = dogsFiltered);

  const initialPages = {
    totalPages: Math.ceil(dogs.length / dogsPerPage),
    pageShowed: parseInt(sessionStorage.getItem("pageData")) || 0,
    indexFirstDogShowed: 0,
    indexLastDogShowed: dogsPerPage,
  };
  const [pages, setPages] = useState(initialPages);
  const { pageShowed, indexFirstDogShowed, indexLastDogShowed } = pages;

  useEffect(() => {
    dispatch(showDogs({ indexFirstDogShowed, indexLastDogShowed }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setPages({
      ...pages,
      pageShowed: parseInt(sessionStorage.getItem("pageData")) || 0,
      // totalPages: Math.ceil(dogs.length / dogsPerPage),
    });
    dispatch(showDogs({ indexFirstDogShowed, indexLastDogShowed }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dogs]);

  useEffect(() => {
    //(() => topCardsRef.current.scrollIntoView({ behavior: "smooth" }))();
    sessionStorage.setItem("pageData", pageShowed);
    window.onunload = function () {
      sessionStorage.removeItem("pageData");
    };
    // pageShowed === 0 && sessionStorage.removeItem("pageData");
    setPages({
      ...pages,
      indexFirstDogShowed: pageShowed * 12,
      indexLastDogShowed: dogsPerPage + pageShowed * 12,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageShowed]);

  useEffect(() => {
    dispatch(showDogs({ indexFirstDogShowed, indexLastDogShowed }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [indexFirstDogShowed]);

  return (
    <div>
      {isItLoading ? (
        <Loader />
      ) : (
        <>
          {dogs && dogs !== dogsFiltered && dogs[0] === null ? (
            <h1>No dogs found</h1>
          ) : (
            <>
              <div className="cards-pag-container">
                <FilterBar pages={pages} setPages={setPages} />
                <div className="cards-container" /* ref={topCardsRef} */>
                  {dogs && dogs[0] === null ? (
                    <h1>No coincidences found</h1>
                  ) : (
                    dogsShowed[0] !== null &&
                    dogsShowed.map((dog) => (
                      <Card dogDetails={dog} key={dog.id} />
                    ))
                  )}
                </div>
                <Pagination pages={pages} setPages={setPages} />
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default CardsContainer;
