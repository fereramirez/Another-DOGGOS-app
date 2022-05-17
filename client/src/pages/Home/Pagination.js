import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { dogsPerPage } from "../../Constants";
import "./Pagination.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDoubleLeft,
  faAngleDoubleRight,
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
    } else if (target.name === "first-page") {
      setPages({
        ...pages,
        pageShowed: 0,
      });
    } else if (target.name === "last-page") {
      setPages({
        ...pages,
        pageShowed: total - 1,
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

  const [width, setWidth] = useState(window.innerWidth);

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }
  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  const isMobile = width <= 650;

  return (
    <div className="pagination-container">
      {total > 1 && (
        <>
          {
            <>
              {isMobile && (
                <button
                  name="first-page"
                  onClick={handleClick}
                  className={`pagination-arrow first-page-arrow ${
                    pageShowed !== 0 && pageShowed !== 1
                      ? ""
                      : "hidden-in-mobile"
                  }`}
                >
                  <span>1</span>
                  <FontAwesomeIcon icon={faAngleDoubleLeft} />
                </button>
              )}
              <button
                name="previous"
                onClick={handleClick}
                className={`pagination-arrow ${
                  pageShowed !== 0 ? "" : "hidden-in-mobile"
                }`}
              >
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>
            </>
          }
          {React.Children.toArray(
            [...Array(total)].map((el, i) =>
              !isMobile ? (
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
                    <>
                      <FontAwesomeIcon icon={faPaw} />
                      <div>{i + 1}</div>
                    </>
                  ) : (
                    i + 1
                  )}
                </button>
              ) : i === pageShowed ||
                i === pageShowed - 1 ||
                i === pageShowed + 1 ? (
                <button
                  name="page"
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
                    <>
                      <FontAwesomeIcon icon={faPaw} />
                      <div>{i + 1}</div>
                    </>
                  ) : (
                    i + 1
                  )}
                </button>
              ) : (
                <></>
              )
            )
          )}
          {
            <>
              <button
                name="next"
                onClick={handleClick}
                className={`pagination-arrow ${
                  pageShowed !== total - 1 ? "" : "hidden-in-mobile"
                }`}
              >
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
              {isMobile && (
                <button
                  name="last-page"
                  onClick={handleClick}
                  className={`pagination-arrow last-page-arrow ${
                    pageShowed !== total - 1 && pageShowed !== total - 2
                      ? ""
                      : "hidden-in-mobile"
                  }`}
                >
                  <FontAwesomeIcon icon={faAngleDoubleRight} />
                  <span>{total}</span>
                </button>
              )}
            </>
          }
        </>
      )}
    </div>
  );
};

export default Pagination;
