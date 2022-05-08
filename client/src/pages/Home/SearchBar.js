import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { searchDogs } from "../../Redux/actions";
import { URL_NAME } from "../../Constants";
import axios from "axios";

const SearchBar = ({ setLoading, setError }) => {
  const [form, setForm] = useState("");
  const dispatch = useDispatch();

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
    sessionStorage.setItem("filterData", "");
    sessionStorage.setItem("pageData", 0);
    sessionStorage.setItem("searchData", form);
    // sessionStorage.setItem("orderByData", "name");
    // sessionStorage.setItem("orderAscData", "asc");
    onbeforeunload = function () {
      sessionStorage.clear();
    };
    setLoading(true);
    axios
      .get(`${URL_NAME}${form}`)
      .then(({ data: dogs }) => {
        dispatch(searchDogs(dogs));
      })
      .catch((err) => {
        if (err.response) {
          setError(`${err.message}: ${err.response.statusText}`);
        } else if (err.request) {
          setError("Server does not respond");
        } else {
          setError("Error " + err.message);
        }
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search breed"
          name="breed"
          onChange={handleChange}
          value={form}
          autoComplete="off"
        />
        {form && <span onClick={handleReset}>x</span>}
        <input type="submit" value="Search" />
      </form>
    </>
  );
};
export default SearchBar;
