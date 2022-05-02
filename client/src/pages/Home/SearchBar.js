import { useState } from "react";
import { useDispatch } from "react-redux";
import { noDogs, searchDogs } from "../../Redux/actions";
import { URL_NAME } from "../../Constants";

const SearchBar = ({ setLoading }) => {
  const [form, setForm] = useState("");
  const dispatch = useDispatch();

  const handleReset = (e) => {
    setForm("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
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
    handleReset();
  };

  const handleChange = (e) => {
    setForm(e.target.value);
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
        />
        <input type="submit" value="Search" />
      </form>
    </>
  );
};
export default SearchBar;
