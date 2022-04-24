import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { filterDogs, orderDogs } from "../../Redux/actions";

const initialOrder = {
  by: "name",
  asc: "asc",
};

const FilterBar = () => {
  const [order, setOrder] = useState(initialOrder);

  const state = useSelector((state) => state);
  const { dogsDB, dogsFound } = state;
  const dispatch = useDispatch();
  let allTemperaments = useRef([]);

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

  const handleFilter = (e) => {
    dispatch(filterDogs(e.target.value));
  };
  useEffect(() => {
    allTemperaments.current = [];
    let dogs, dogTemperaments;
    dogsFound.length === 0 ? (dogs = dogsDB) : (dogs = dogsFound);

    for (const dog of dogs) {
      dog.temperament &&
        (dogTemperaments = dog.temperament.replace(/,/g, "").split(" "));
      for (const temperament of dogTemperaments) {
        allTemperaments.current.includes(temperament) ||
          allTemperaments.current.push(temperament);
      }
    }
    allTemperaments.current.sort();
  }, [dogsDB, dogsFound]);

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
      <select name="temperament" onChange={handleFilter}>
        {allTemperaments.current.map((temperament) => (
          <option value={temperament} key={temperament}>
            {temperament}
          </option>
        ))}
      </select>
    </>
  );
};
export default FilterBar;
