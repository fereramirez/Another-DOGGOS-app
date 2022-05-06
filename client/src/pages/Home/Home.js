import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import CardsContainer from "./CardsContainer";
import SearchBar from "./SearchBar";
import { getAllDogs, noDogs } from "../../Redux/actions/index.js";
import { URL } from "../../Constants";
import axios from "axios";

const Home = () => {
  const [loading, setLoading] = useState(false);
  //const dogsShowed=useSelector(state=>state.dogsShowed)
  const dispatch = useDispatch();

  useEffect(() => {
    let notFirstLoad = sessionStorage.getItem("notFirstLoad");
    if (!notFirstLoad) {
      setLoading(true);
      axios
        .get(URL)
        .then(({ data: dogs }) => {
          dispatch(getAllDogs(dogs));
          sessionStorage.setItem("notFirstLoad", true);
          setLoading(false);
        })
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
