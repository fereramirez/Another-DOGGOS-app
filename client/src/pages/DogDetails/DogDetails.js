import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import Loader from "../../components/Loader";
import Error from "../../components/Error";
import { deleteDog, getDog } from "../../Redux/actions";
import { URL } from "../../Constants";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Modal from "../../components/Modal";
import { useModal } from "../../hooks/useModal";

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
  const [error, setError] = useState(null);
  const [errorDelete, setErrorDelete] = useState("");
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isOpenDelete, openModalDelete, closeModalDelete] = useModal();
  const [isOpenEdit, openModalEdit, closeModalEdit] = useModal();
  const [isOpenSuccess, openModalSuccess, closeModalSuccess] = useModal();
  const [isOpenFail, openModalFail, closeModalFail] = useModal();

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
        dispatch(getDog(dog));
      })
      .catch((err) => {
        if (err.response) {
          setError(`${err.message}: ${err.response.statusText}`);
        } else if (err.request) {
          setError("Server does not respond");
        } else {
          setError("Error " + err.message);
        }
      })
      .finally(() => setLoading(false));

    return () => {
      dispatch(getDog({}));
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEdit = () => {
    sessionStorage.setItem("editDogData", "true");
    navigate("/createdog");
  };

  const handleDelete = (idDelete) => {
    setLoading(true);
    closeModalDelete();
    closeModalFail();
    axios
      .delete(`${URL}${idDelete}`)
      .then((res) => {
        openModalSuccess();
        dispatch(deleteDog(idDelete));
        setTimeout(() => navigate("/home"), 5000);
      })
      .catch((err) => {
        console.log(err);
        if (err.response) {
          setErrorDelete(`${err.message}: ${err.response.statusText}`);
        } else if (err.request) {
          setErrorDelete("Server does not respond");
        } else {
          setErrorDelete("Error " + err.message);
        }
        openModalFail();
      });
    //.finally(() => setLoading(false));
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : error ? (
        <Error message={error} />
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
                <button onClick={openModalEdit}>Edit</button>
                {/* <button onClick={() => handleDelete(idDelete)}>Delete</button> */}
                <button onClick={openModalDelete}>Delete</button>
              </>
            )}
          </>
        )
      )}
      <Modal isOpen={isOpenDelete} closeModal={closeModalDelete}>
        <p>{`Delete ${details.name}?`}</p>
        <button onClick={() => handleDelete(idDelete)}>Accept</button>
        <button onClick={closeModalDelete}>Cancel</button>
      </Modal>
      <Modal isOpen={isOpenEdit} closeModal={closeModalEdit}>
        <p>{`Edit ${details.name}?`}</p>
        <button onClick={handleEdit}>Accept</button>
        <button onClick={closeModalEdit}>Cancel</button>
      </Modal>
      <span onClick={() => navigate("/home")}>
        <Modal isOpen={isOpenSuccess} closeModal={closeModalSuccess}>
          <p>{`${details.name} deleted successfully`}</p>
          <p>Returning to Home</p>
        </Modal>
      </span>
      <Modal isOpen={isOpenFail} closeModal={closeModalFail}>
        <p>{`Failed to delete ${details.name}`}</p>
        <p>{`${errorDelete}`}</p>
        <button onClick={() => handleDelete(idDelete)}>Try again</button>
        <button onClick={closeModalFail}>Cancel</button>
      </Modal>
    </>
  );
};

export default DogDetails;
