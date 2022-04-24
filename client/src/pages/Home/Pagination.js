import { useEffect } from "react";
import { useSelector } from "react-redux";

const Pagination = ({ pages, setPages }) => {
  const { totalPages, pageShowed } = pages;
  const state = useSelector((state) => state);
  const { dogsDB, dogsFound, dogsFiltered } = state;

  let dogs;

  dogsFound.length === 0 && dogsFiltered.length === 0
    ? (dogs = dogsDB)
    : dogsFiltered.length === 0
    ? (dogs = dogsFound)
    : (dogs = dogsFiltered);

  const handleClick = (e) => {
    setPages({
      ...pages,
      pageShowed: e.target.value,
    });
  };

  useEffect(() => {
    console.log(pageShowed);
    let buttons = document.querySelectorAll("button");
    //console.log(buttons[0].disabled);
    //buttons[0].disabled = true;
  }, []);

  useEffect(() => {
    let buttons = document.querySelectorAll("button");
    for (const button of buttons) {
      button.value === pageShowed
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
          disabled={i === pageShowed ? true : false}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
