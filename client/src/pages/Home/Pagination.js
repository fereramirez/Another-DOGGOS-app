import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { dogsPerPage } from "../../Constants";
import "./Pagination.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronRight,
  faPaw,
} from "@fortawesome/free-solid-svg-icons";

const Pagination = ({ pages, setPages }) => {
  const { totalPages, pageShowed } = pages;
  const state = useSelector((state) => state);
  const { dogsAll, dogsFound, dogsFiltered } = state;
  const [total, setTotal] = useState(totalPages);

  let dogs;

  dogsFound.length === 0 && dogsFiltered.length === 0
    ? (dogs = dogsAll)
    : dogsFiltered.length === 0
    ? (dogs = dogsFound)
    : (dogs = dogsFiltered);

  const handleClick = ({ target }) => {
    if (target.name === "page") {
      setPages({
        ...pages,
        pageShowed: parseInt(target.value),
      });
    } else if (target.name === "next") {
      setPages({
        ...pages,
        pageShowed: pages.pageShowed + 1,
      });
    } else if (target.name === "previous") {
      setPages({
        ...pages,
        pageShowed: pages.pageShowed - 1,
      });
    }
  };

  useEffect(() => {
    let initialPage = sessionStorage.getItem("pageData") || 0;
    setPages({
      ...pages,
      pageShowed: parseInt(initialPage),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let buttons = document.querySelectorAll("button");
    for (const button of buttons) {
      parseInt(button.value) === parseInt(pageShowed)
        ? (button.disabled = true)
        : (button.disabled = false);
    }
  }, [pageShowed, dogs]);

  useEffect(() => {
    setTotal(Math.ceil(dogs.length / dogsPerPage));
  }, [dogs]);

  return (
    <div className="pagination-container">
      {total > 1 && (
        <>
          {pageShowed !== 0 && (
            <button
              name="previous"
              onClick={handleClick}
              className="pagination-arrow"
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
          )}
          {[...Array(total)].map((el, i) => (
            <button
              name="page"
              key={i}
              onClick={handleClick}
              value={i}
              disabled={parseInt(i) === parseInt(pageShowed) ? true : false}
              className={
                parseInt(i) === parseInt(pageShowed)
                  ? "current-page"
                  : "page-button"
              }
            >
              {parseInt(i) === parseInt(pageShowed) ? (
                <FontAwesomeIcon icon={faPaw} />
              ) : (
                i + 1
              )}
            </button>
          ))}
          {pageShowed !== total - 1 && (
            <button
              name="next"
              onClick={handleClick}
              className="pagination-arrow"
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default Pagination;
