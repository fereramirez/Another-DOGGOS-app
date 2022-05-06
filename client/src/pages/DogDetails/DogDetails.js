import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import Loader from "../../components/Loader";
import { noDogs, deleteDog } from "../../Redux/actions";
import { URL } from "../../Constants";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const initialDetails = {
  name: "",
  height: "",
  weight: "",
  image: "",
  life_span: "",
  temperament: "",
};

const DogDetails = () => {
  const [details, setDetails] = useState(initialDetails);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    name,
    height,
    weight,
    image,
    life_span,
    temperament,
    id: idDelete,
  } = details;

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${URL}${id}`)
      .then(({ data: dog }) => {
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

  const handleEdit = () => {};

  const handleDelete = (idDelete) => {
    axios.delete(`${URL}${idDelete}`).then((res) => {
      dispatch(deleteDog(idDelete));
      navigate("/home");
    });
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        details && (
          <>
            <h1>{name}</h1>
            {/* <img src={image.url} alt={name} height="120" weight="120" /> */}
            <div>Height: {height.metric} cms.</div>
            <div>Weight: {weight.metric} kgs.</div>
            <div>Life Span: {life_span}</div>
            <div>Temperament: {temperament}</div>
            {typeof details.id === "string" && (
              <>
                <button onClick={handleEdit}>Edit</button>
                <button onClick={() => handleDelete(idDelete)}>Delete</button>
              </>
            )}
          </>
        )
      )}
    </>
  );
};

export default DogDetails;
