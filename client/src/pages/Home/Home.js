import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import CardsContainer from "./CardsContainer";
import SearchBar from "./SearchBar";
import { getAllDogs, noDogs } from "../../Redux/actions/index.js";

const { REACT_APP_API_KEY } = process.env;

const Home = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setLoading(true);
    fetch(`https://api.thedogapi.com/v1/breeds`, {
      headers: { "x-api-key": `${REACT_APP_API_KEY}` },
    })
      .then((res) => res.json())
      .then((json) => {
        dispatch(getAllDogs(json));
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        dispatch(noDogs());
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <SearchBar setLoading={setLoading} />
      <CardsContainer loading={loading} />
    </>
  );
};

export default Home;
