import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { filterDogs, orderDogs } from "../../Redux/actions";

const initialOrder = {
  by: "name",
  asc: "asc",
};

const FilterBar = () => {
  const [order, setOrder] = useState(initialOrder);
  const [filter, setFilter] = useState("");

  const state = useSelector((state) => state);
  const { dogsAll, dogsFound, dogsFiltered } = state;
  const dispatch = useDispatch();
  let allTemperaments = useRef([]);

  useEffect(() => {
    let initialFilter = sessionStorage.getItem("filterData") || "";
    setFilter(initialFilter);
  }, []);

  const handleOrder = (e) => {
    setOrder({
      ...order,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    dispatch(orderDogs(order));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order]);

  const handleChange = (e) => {
    let value = e.target.value.toLowerCase();
    value = value.charAt(0).toUpperCase() + value.slice(1).replace("_", " ");
    setFilter(value);
  };

  useEffect(() => {
    allTemperaments.current = [];
    let dogs, dogTemperaments;
    dogsFound.length === 0 ? (dogs = dogsAll) : (dogs = dogsFound);
    //!VOLVER A VER modificar
    for (const dog of dogs) {
      dog.temperament &&
        (dogTemperaments = dog.temperament.replace(/,/g, "").split(" "));
      for (const temperament of dogTemperaments) {
        allTemperaments.current.includes(temperament) ||
          allTemperaments.current.push(temperament);
      }
    }
    allTemperaments.current.sort();
    allTemperaments.current.unshift(null);
  }, [dogsAll, dogsFound]);

  const handleReset = () => {
    setFilter("");
  };

  useEffect(() => {
    filter
      ? sessionStorage.setItem("filterData", filter)
      : sessionStorage.removeItem("filterData");

    window.onbeforeunload = function () {
      sessionStorage.clear();
    };
    dispatch(filterDogs(filter));
  }, [filter]);

  useEffect(() => {
    if (dogsFiltered.length === 0 && filter) dispatch(filterDogs(filter));
  }, [dogsFiltered]);

  return (
    <>
      <select name="by" onChange={handleOrder} defaultValue="name">
        <option value="name">By name</option>
        <option value="weight">By weight</option>
      </select>
      <select name="asc" onChange={handleOrder} defaultValue="asc">
        <option value="asc">
          {order.by === "name" ? "A-Z" : "Less weight"}
        </option>
        <option value="desc">
          {order.by === "name" ? "Z-A" : "More weight"}
        </option>
      </select>
      {/* <select name="temperament" onChange={handleFilter}>
        {allTemperaments.current.map((temperament) => (
          <option value={temperament} key={temperament}>
            {temperament}
          </option>
        ))}
      </select> */}
      <input
        name="filter"
        list="allTemperaments"
        onChange={handleChange}
        value={filter}
        autoComplete="off"
      />
      <datalist id="allTemperaments">
        {allTemperaments.current.map((temperament) => (
          <option value={temperament} key={temperament} />
        ))}
      </datalist>
      {filter && <span onClick={handleReset}>x</span>}
    </>
  );
};
export default FilterBar;
