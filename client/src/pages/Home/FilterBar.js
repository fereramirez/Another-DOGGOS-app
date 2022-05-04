import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { filterDogs, orderDogs, showDogs } from "../../Redux/actions";

const initialOrder = {
  by: "name",
  asc: "asc",
};

const FilterBar = ({ pages, setPages }) => {
  const [order, setOrder] = useState(initialOrder);
  const [filter, setFilter] = useState("");

  const state = useSelector((state) => state);
  const { dogsAll, dogsFound, dogsFiltered, dogsShowed } = state;
  const dispatch = useDispatch();
  let allTemperaments = useRef([]);
  const { indexFirstDogShowed, indexLastDogShowed } = pages;

  useEffect(() => {
    let initialFilter = sessionStorage.getItem("filterData") || "";
    let orderData = {
      by: "name",
      asc: "asc",
    };
    orderData.by = sessionStorage.getItem("orderByData");
    orderData.asc = sessionStorage.getItem("orderAscData");
    setFilter(initialFilter);
    if (
      orderData.by !== initialOrder.by ||
      orderData.asc !== initialOrder.asc
    ) {
      setOrder({
        by: orderData.by,
        asc: orderData.asc,
      });
    } else {
      sessionStorage.removeItem("orderByData");
      sessionStorage.removeItem("orderAscData");
    }
  }, []);

  const handleOrder = (e) => {
    setOrder({
      ...order,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    dispatch(orderDogs(order));
    dispatch(showDogs({ indexFirstDogShowed, indexLastDogShowed }));
    sessionStorage.setItem("orderByData", order.by);
    sessionStorage.setItem("orderAscData", order.asc);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order]);

  const handleChange = ({ target }) => {
    if (target.validity.valid) {
      setFilter(target.value);
      sessionStorage.setItem("pageData", 0);
    }
  };

  useEffect(() => {
    allTemperaments.current = [];
    let dogs, dogTemperaments;
    dogsFound.length === 0 ? (dogs = dogsAll) : (dogs = dogsFound);
    let initialFilter = sessionStorage.getItem("filterData") || "";
    setFilter(initialFilter);

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
    sessionStorage.setItem("pageData", 0);
    setPages({
      ...pages,
      pageShowed: 0,
    });
  };

  useEffect(() => {
    filter
      ? sessionStorage.setItem("filterData", filter)
      : sessionStorage.removeItem("filterData");
    window.onbeforeunload = function () {
      sessionStorage.clear();
    };
    dispatch(filterDogs(filter));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  useEffect(() => {
    if (dogsFiltered.length === 0 && filter) dispatch(filterDogs(filter));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dogsFiltered]);

  return (
    <>
      <select
        name="by"
        onChange={handleOrder}
        //  defaultValue="name"
        value={order.by}
      >
        <option value="name">By name</option>
        <option value="weight">By weight</option>
      </select>
      <select
        name="asc"
        onChange={handleOrder}
        // defaultValue="asc"
        value={order.asc}
      >
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
        placeholder="Filter by temperament"
        pattern="^[A-Za-zÑñÁáÉéÍíÓóÚúÜüs]+$"
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
