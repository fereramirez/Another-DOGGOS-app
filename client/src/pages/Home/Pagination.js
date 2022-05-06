import { useEffect } from "react";
import { useSelector } from "react-redux";

const Pagination = ({ pages, setPages }) => {
  const { totalPages, pageShowed } = pages;
  const state = useSelector((state) => state);
  const { dogsAll, dogsFound, dogsFiltered } = state;

  let dogs;

  dogsFound.length === 0 && dogsFiltered.length === 0
    ? (dogs = dogsAll)
    : dogsFiltered.length === 0
    ? (dogs = dogsFound)
    : (dogs = dogsFiltered);

  const handleClick = ({ target }) => {
    parseInt(target.value) === 0 && sessionStorage.removeItem("pageData");
    sessionStorage.setItem("pageData", target.value);
    setPages({
      ...pages,
      pageShowed: parseInt(target.value),
    });
  };

  useEffect(() => {
    console.log("se monta paginado");
    let initialPage = sessionStorage.getItem("pageData") || 0;
    setPages({
      ...pages,
      pageShowed: parseInt(initialPage),
    });
    window.onunload = function () {
      sessionStorage.removeItem("pageData");
    };
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

  return (
    <div>
      {[...Array(totalPages)].map((el, i) => (
        <button
          key={i}
          onClick={handleClick}
          value={i}
          disabled={parseInt(i) === parseInt(pageShowed) ? true : false}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
