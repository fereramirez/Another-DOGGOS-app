import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CardsContainer from "./CardsContainer";
//import SearchBar from "./SearchBar";
import {
  getAllDogs,
  errorLoading,
  loading,
} from "../../Redux/actions/index.js";
//import { isItLoading, thereWasAnError } from "../../Redux/reducer/index";
import { URL } from "../../Constants";
import Error from "../../components/Error";
import axios from "axios";

const Home = () => {
  //const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const thereWasAnError = useSelector((state) => state.thereWasAnError);

  useEffect(() => {
    let notFirstLoad = sessionStorage.getItem("notFirstLoad");
    if (!notFirstLoad) {
      dispatch(loading(true));
      axios
        .get(URL)
        .then(({ data: dogs }) => {
          dispatch(getAllDogs(dogs));
          dispatch(errorLoading(false));
          sessionStorage.setItem("notFirstLoad", true);
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
    }
    window.onbeforeunload = function () {
      sessionStorage.clear();
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {thereWasAnError ? (
        <div className="dumb-for-error">
          <Error message={error} />
        </div>
      ) : (
        //! VOLVER A VER poner div y darle margin top para que Error no sea tapado por NavBar
        <>
          {/* <SearchBar setLoading={setLoading} setError={setError} /> */}
          <CardsContainer />
        </>
      )}
    </>
  );
};

export default Home;
