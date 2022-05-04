import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CardsContainer from "./CardsContainer";
import SearchBar from "./SearchBar";
import { getAllDogs, noDogs, showDogs } from "../../Redux/actions/index.js";
import { URL } from "../../Constants";
import Loader from "../../components/Loader";

const Home = () => {
  const [loading, setLoading] = useState(false);
  //const dogsShowed=useSelector(state=>state.dogsShowed)
  const dispatch = useDispatch();

  useEffect(() => {
    let notFirstLoad = sessionStorage.getItem("notFirstLoad");
    if (!notFirstLoad) {
      setLoading(true);
      fetch(URL)
        .then((res) => res.json())
        .then((json) => {
          dispatch(getAllDogs(json));
          sessionStorage.setItem("notFirstLoad", true);
          setLoading(false);
        })
        // .then((dogs) => dispatch(showDogs(0, 12)))
        .catch((err) => {
          console.log(err);
          dispatch(noDogs());
          setLoading(false);
        });
    }
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
