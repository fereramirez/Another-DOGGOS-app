import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { noDogs, searchDogs } from "../../Redux/actions";
import { URL_NAME } from "../../Constants";

const SearchBar = ({ setLoading }) => {
  const [form, setForm] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    let initialInput = sessionStorage.getItem("searchData") || "";
    setForm(initialInput);
  }, []);

  const handleChange = (e) => {
    setForm(e.target.value);
  };

  const handleReset = (e) => {
    setForm("");
    sessionStorage.removeItem("searchData");
    dispatch(searchDogs([]));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sessionStorage.setItem("searchData", form);
    onbeforeunload = function () {
      sessionStorage.clear();
    };
    setLoading(true);
    fetch(`${URL_NAME}${form}`)
      .then((res) => res.json())
      .then((json) => {
        dispatch(searchDogs(json));
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        dispatch(noDogs());
        setLoading(false);
      });
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
