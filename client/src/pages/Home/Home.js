import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import CardsContainer from "./CardsContainer";
import SearchBar from "./SearchBar";
import { getAllDogs } from "../../Redux/actions/index.js";
import { URL } from "../../Constants";
import Error from "../../components/Error";
import axios from "axios";

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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
        })
        .catch((err) => {
          if (err.response) {
            setError(`${err.message}: ${err.response.data}`);
          } else if (err.request) {
            setError("Server does not respond");
          } else {
            setError("Error " + err.message);
          }
        })
        .finally(() => setLoading(false));
    }
    window.onbeforeunload = function () {
      sessionStorage.clear();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {error ? (
        <Error message={error} />
      ) : (
        <>
          <SearchBar setLoading={setLoading} setError={setError} />
          <CardsContainer loading={loading} />
        </>
      )}
    </>
  );
};

export default Home;
