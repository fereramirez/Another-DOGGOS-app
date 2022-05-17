import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { filterDogs, orderDogs, showDogs } from "../../Redux/actions";
import "./FilterBar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

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
  const topCardsRef = useRef(null);
  const [show, setShow] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

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
    if (e.target.name === "by") {
      setOrder({
        [e.target.name]: e.target.value,
        asc: "asc",
      });
    } else {
      setOrder({
        ...order,
        [e.target.name]: e.target.value,
      });
    }
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
    sessionStorage.setItem("filterApiData", filter.api);
    sessionStorage.setItem("filterOwnData", filter.own);

    dispatch(filterDogs(filter));
    setPages({
      ...pages,
      pageShowed: 0,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter.api, filter.own]);

  useEffect(() => {
    filter.temperament
      ? sessionStorage.setItem("filterTemperamentData", filter.temperament)
      : sessionStorage.removeItem("filterTemperamentData");
    dispatch(filterDogs(filter));
    setPages({
      ...pages,
      pageShowed: 0,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter.temperament]);

  useEffect(() => {
    if (dogsFiltered.length === 0 && filter.temperament)
      dispatch(filterDogs(filter));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dogsFiltered]);

  const controlNavbar = () => {
    if (typeof window !== "undefined") {
      if (window.scrollY < lastScrollY) {
        setShow(false);
      } else {
        setShow(true);
      }
      setLastScrollY(window.scrollY);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("scroll", controlNavbar);

      return () => {
        window.removeEventListener("scroll", controlNavbar);
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastScrollY]);

  return (
    <div
      className={`filter-container ${show ? "hidden" : ""}`}
      ref={topCardsRef}
    >
      <div className="check-container aa">
        <label className={`${!filter.api ? "checked" : ""}`}>
          <input
            name="api"
            type="checkbox"
            checked={filter.api}
            onChange={handleChecked}
          />
          API dogs
        </label>
        <label className={`${!filter.own ? "checked" : ""}`}>
          <input
            name="own"
            type="checkbox"
            checked={filter.own}
            onChange={handleChecked}
          />
          Created
        </label>
      </div>
      <div className="order-container bb">
        <label htmlFor="order">Order by </label>
        <div className="order-container">
          <select
            name="by"
            id="order"
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
      </div>
      {/* <select name="temperament" onChange={handleFilter}>
        {allTemperaments.current.map((temperament) => (
          <option value={temperament} key={temperament}>
            {temperament}
          </option>
        ))}
      </select> */}
      <div className="temp-filter-container cc">
        <label htmlFor="temperament">Filter </label>
        <span className="input-temp-container">
          <input
            name="temperament"
            id="temperament"
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
          {filter.temperament && (
            <div onClick={handleResetTemperament} className="x-mark">
              <FontAwesomeIcon icon={faXmark} />
            </div>
          )}
        </span>
      </div>
    </div>
  );
};
export default FilterBar;
