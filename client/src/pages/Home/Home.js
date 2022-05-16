import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CardsContainer from "./CardsContainer";
import {
  getAllDogs,
  errorLoading,
  loading,
} from "../../Redux/actions/index.js";
import { URL } from "../../Constants";
import Error from "../../components/Error";
import axios from "axios";

const Home = () => {
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
            err.response.data
              ? setError(`${err.message}: ${err.response.data}`)
              : setError(err.message);
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
        <>
          <CardsContainer />
        </>
      )}
    </>
  );
};

export default Home;
