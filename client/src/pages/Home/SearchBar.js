import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { searchDogs, errorLoading, loading } from "../../Redux/actions";
import { URL_NAME } from "../../Constants";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./SearchBar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faXmark } from "@fortawesome/free-solid-svg-icons";

const SearchBar = ({ setError }) => {
  const [form, setForm] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const thereWasAnError = useSelector((state) => state.thereWasAnError);

  useEffect(() => {
    let initialInput = sessionStorage.getItem("searchData") || "";
    setForm(initialInput);
  }, []);

  const handleChange = (e) => {
    setForm(e.target.value);
    !e.target.value && handleReset();
  };

  const handleReset = (e) => {
    setForm("");
    sessionStorage.setItem("pageData", 0);
    sessionStorage.setItem("filterData", "");
    sessionStorage.removeItem("searchData");
    // sessionStorage.setItem("orderByData", "name");
    // sessionStorage.setItem("orderAscData", "asc");
    dispatch(searchDogs([]));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/home");
    sessionStorage.setItem("filterData", "");
    sessionStorage.setItem("pageData", 0);
    sessionStorage.setItem("searchData", form);
    // sessionStorage.setItem("orderByData", "name");
    // sessionStorage.setItem("orderAscData", "asc");
    dispatch(loading(true));
    axios
      .get(`${URL_NAME}${form}`)
      .then(({ data: dogs }) => {
        dispatch(searchDogs(dogs));
        dispatch(errorLoading(false));
      })
      .catch((err) => {
        dispatch(errorLoading(true));
        if (err.response) {
          setError(`${err.message}: ${err.response.data}`);
        } else if (err.request) {
          setError("Server does not respond");
        } else {
          setError("Error " + err.message);
        }
      })
      .finally(() => dispatch(loading(false)));
  };

  return (
    <>
      {thereWasAnError || (
        <form onSubmit={handleSubmit} className="inputWithButton">
          <input
            type="text"
            placeholder="Search breed"
            name="breed"
            onChange={handleChange}
            value={form}
            autoComplete="off"
          />
          {form && (
            <div>
              <div onClick={handleReset} className="x-mark">
                <FontAwesomeIcon icon={faXmark} />
              </div>
              <span onClick={handleSubmit} className="search-svg">
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </span>
            </div>
          )}
        </form>
      )}
    </>
  );
};
export default SearchBar;
