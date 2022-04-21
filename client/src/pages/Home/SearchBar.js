import { useState } from "react";
import { useDispatch } from "react-redux";
import { noDogs, searchDogs } from "../../Redux/actions";

const { REACT_APP_API_KEY } = process.env;

const SearchBar = ({ setLoading }) => {
  const [form, setForm] = useState("");
  const dispatch = useDispatch();

  const handleReset = (e) => {
    setForm("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    fetch(`https://api.thedogapi.com/v1/breeds/search?q=${form}`, {
      headers: { "x-api-key": `${REACT_APP_API_KEY}` },
    })
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
