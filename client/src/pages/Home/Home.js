import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CardsContainer from "./CardsContainer";
import SearchBar from "./SearchBar";
import { firstLoad, getAllDogs, noDogs } from "../../Redux/actions/index.js";
import { API_URL } from "../../Constants";

const { REACT_APP_API_KEY } = process.env;

const Home = () => {
  const isItLoaded = useSelector((state) => state.isItLoaded);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    // if (isItLoaded) {
    setLoading(true);
    fetch(`${API_URL}`, {
      headers: { "x-api-key": `${REACT_APP_API_KEY}` },
    })
      .then((res) => res.json())
      .then((json) => {
        dispatch(getAllDogs(json));
        setLoading(false);
        dispatch(firstLoad());
      })
      .catch((err) => {
        console.log(err);
        dispatch(noDogs());
        setLoading(false);
      });
    //  }
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
