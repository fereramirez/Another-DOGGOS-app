import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { filterDogs, orderDogs, showDogs } from "../../Redux/actions";

const initialOrder = {
  by: "name",
  asc: "asc",
};
const initialFilter = {
  temperament: "",
  api: true,
  own: true,
};

const FilterBar = ({ pages, setPages }) => {
  const [order, setOrder] = useState(initialOrder);
  const [filter, setFilter] = useState(initialFilter);

  const state = useSelector((state) => state);
  const { dogsAll, dogsFound, dogsFiltered } = state;
  const dispatch = useDispatch();
  let allTemperaments = useRef([]);
  const { indexFirstDogShowed, indexLastDogShowed } = pages;

  const handleChecked = ({ target }) => {
    setFilter({
      ...filter,
      [target.name]: !filter[target.name],
    });
  };

  useEffect(() => {
    let filterData = {
      temperament: "",
      api: "true",
      own: "true",
    };
    filterData.temperament =
      sessionStorage.getItem("filterTemperamentData") || "";
    filterData.api = sessionStorage.getItem("filterApiData") || "true";
    filterData.own = sessionStorage.getItem("filterOwnData") || "true";

    let orderData = {
      by: "name",
      asc: "asc",
    };
    orderData.by = sessionStorage.getItem("orderByData") || "name";
    orderData.asc = sessionStorage.getItem("orderAscData") || "asc";

    /* if (
      filterData.temperament !== initialFilter.temperament ||
      filterData.api !== "true" ||
      filterData.own !== "true"
    ) { */
    setFilter({
      temperament: filterData.temperament,
      api: filterData.api === "true" ? true : false,
      own: filterData.own === "true" ? true : false,
    });
    /* } else {
      sessionStorage.removeItem("filterTemperamentData");
      sessionStorage.removeItem("filterApiData");
      sessionStorage.removeItem("filterOwnData");
    } */

    /* if (
      orderData.by !== initialOrder.by ||
      orderData.asc !== initialOrder.asc
    ) { */
    setOrder({
      by: orderData.by,
      asc: orderData.asc,
    });
    /*   } else {
      sessionStorage.removeItem("orderByData");
      sessionStorage.removeItem("orderAscData");
    } */
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
      setFilter({
        ...filter,
        temperament: target.value,
      });
      sessionStorage.setItem("pageData", 0);
    }
  };

  useEffect(() => {
    allTemperaments.current = [];
    let dogs, dogTemperaments;
    dogsFound.length === 0 ? (dogs = dogsAll) : (dogs = dogsFound);

    let filterData = {
      temperament: "",
      api: "true",
      own: "true",
    };
    filterData.temperament =
      sessionStorage.getItem("filterTemperamentData") || "";
    filterData.api = sessionStorage.getItem("filterApiData") || "true";
    filterData.own = sessionStorage.getItem("filterOwnData") || "true";
    setFilter({
      temperament: filterData.temperament,
      api: filterData.api === "true" ? true : false,
      own: filterData.own === "true" ? true : false,
    });

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
    // allTemperaments.current.unshift(null);
  }, [dogsAll, dogsFound]);

  const handleResetTemperament = () => {
    setFilter({
      ...filter,
      temperament: "",
    });
    sessionStorage.setItem("pageData", 0);
    setPages({
      ...pages,
      pageShowed: 0,
    });
  };

  useEffect(() => {
    dispatch(filterDogs(filter));

    filter.temperament
      ? sessionStorage.setItem("filterTemperamentData", filter.temperament)
      : sessionStorage.removeItem("filterTemperamentData");
    sessionStorage.setItem("filterApiData", filter.api);
    sessionStorage.setItem("filterOwnData", filter.own);

    window.onbeforeunload = function () {
      sessionStorage.clear();
    };
    setPages({
      ...pages,
      pageShowed: 0,
    });
    sessionStorage.setItem("pageData", 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  /*  useEffect(() => {
    if (dogsFiltered.length === 0 && filter.temperament)
      dispatch(filterDogs(filter));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dogsFiltered]); */

  return (
    <>
      <label>
        <input
          name="api"
          type="checkbox"
          checked={filter.api}
          // defaultChecked={filter.api}
          onChange={handleChecked}
        />
        API dogs
      </label>
      <label>
        <input
          name="own"
          type="checkbox"
          checked={filter.own}
          //defaultChecked={filter.own}
          onChange={handleChecked}
        />
        Own dogs
      </label>
      <div>
        <span>Order by </span>
        <select
          name="by"
          onChange={handleOrder}
          //  defaultValue="name"
          value={order.by}
        >
          <option value="name">Name</option>
          <option value="weight">Weight</option>
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
      </div>
      {/* <select name="temperament" onChange={handleFilter}>
        {allTemperaments.current.map((temperament) => (
          <option value={temperament} key={temperament}>
            {temperament}
          </option>
        ))}
      </select> */}
      <div>
        <span>Filter </span>
        <input
          name="temperament"
          placeholder="by Temperament"
          pattern="^[A-Za-zÑñÁáÉéÍíÓóÚúÜüs]+$"
          list="allTemperaments"
          onChange={handleChange}
          value={filter.temperament}
          autoComplete="off"
        />
        <datalist id="allTemperaments">
          {allTemperaments.current.map((temperament) => (
            <option value={temperament} key={temperament} />
          ))}
        </datalist>
        {filter.temperament && <span onClick={handleResetTemperament}>x</span>}
      </div>
    </>
  );
};
export default FilterBar;
