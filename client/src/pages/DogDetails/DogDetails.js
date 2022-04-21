import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import Loader from "../../components/Loader";
import { getAllDogs, noDogs } from "../../Redux/actions";

const { REACT_APP_API_KEY } = process.env;

const DogDetails = () => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    setLoading(true);
    fetch(`https://api.thedogapi.com/v1/breeds`, {
      headers: { "x-api-key": `${REACT_APP_API_KEY}` },
    })
      .then((res) => res.json())
      .then((json) => {
        dispatch(getAllDogs(json));
        let dog = json.find((dog) => dog.id === parseInt(id));
        setDetails(dog);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        dispatch(noDogs());
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{loading ? <Loader /> : details && <h1>{details.name}</h1>}</>;
};

export default DogDetails;
