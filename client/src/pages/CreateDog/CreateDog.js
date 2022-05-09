import { useEffect, useRef, useState } from "react";
import Loader from "../../components/Loader";
import Error from "../../components/Error";
import { URL } from "../../Constants";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createDog, editDog } from "../../Redux/actions";
import Modal from "../../components/Modal";
import { useModal } from "../../hooks/useModal";

const initialForm = {
  name: "",
  min_height: "",
  max_height: "",
  min_weight: "",
  max_weight: "",
  life_span: "",
  temperaments: [],
};

const initialFocusInfo = {
  name: false,
  min_height: false,
  max_height: false,
  min_weight: false,
  max_weight: false,
  life_span: false,
  temperaments: false,
};
const regex = {
  name: "^[A-Za-zÑñÁáÉéÍíÓóÚúÜüs ]+$",
  number: "[0-9]*",
};

const CreateDog = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const dogDetails = useSelector((state) => state.dogDetails);
  const [dogToUpdate, setDogToUpdate] = useState(dogDetails);
  //const [newDog, setNewDog] = useState({});
  const newDog = useRef({});
  //const [response, setResponse] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [focusInfo, setFocusInfo] = useState(initialFocusInfo);
  const [warnForm, setWarnForm] = useState({});
  const [errors, setErrors] = useState({});
  const [showErrors, setShowErrors] = useState(false);
  const [errorEdit, setErrorEdit] = useState("");
  const [errorCreate, setErrorCreate] = useState("");
  const [isOpenEditSuccess, openModalEditSuccess, closeModalEditSuccess] =
    useModal();
  const [isOpenEditFail, openModalEditFail, closeModalEditFail] = useModal();
  const [isOpenEditSame, openModalEditSame, closeModalEditSame] = useModal();
  const [isOpenCreateSuccess, openModalCreateSuccess, closeModalCreateSuccess] =
    useModal();
  const [isOpenCreateFail, openModalCreateFail, closeModalCreateFail] =
    useModal();
  // const [addTemperament, setAddTemperament] = useState(false);
  // const [newTemperament, setNewTemperament] = useState("");
  let allTemperaments = useRef([]);
  //let temperamentsToString = useRef("");
  let timeout;
  let timeoutId = useRef();

  const {
    name,
    min_height,
    max_height,
    min_weight,
    max_weight,
    life_span,
    temperaments,
  } = form;
  const arrForRender = [
    "min_height",
    "max_height",
    "min_weight",
    "max_weight",
    "life_span",
  ];

  const validateForm = () => {
    let error = {};

    if (!name.trim()) error.name = "Breed name is empty";
    if (!min_height) error.min_height = "Minimum height is empty";
    if (!max_height) error.max_height = "Maximum height is empty";
    if (parseInt(min_height) > parseInt(max_height)) {
      error.min_height = "Min height can not be higher than max height";
      error.max_height = "";
    }
    if (!min_weight) error.min_weight = "Minimum weight is empty";
    if (!max_weight) error.max_weight = "Maximum weight is empty";
    if (parseInt(min_weight) > parseInt(max_weight)) {
      error.min_weight = "Min weight can not be higher than max weight";
      error.max_weight = "";
    }
    if (!life_span) error.life_span = "Life span is empty";

    if (temperaments.length < 1)
      error.temperaments = "No temperaments selected";

    return error;
  };

  const handleFocus = (e) => {
    setFocusInfo({
      ...focusInfo,
      [e.target.name]: true,
    });
  };

  const deleteTemperament = (temp) => {
    setForm({
      ...form,
      temperaments: temperaments.filter((temperament) => temperament !== temp),
    });
    clearTimeout(timeoutId.current);
  };

  const handleChange = ({ target }) => {
    const { name, value, type, validity, pattern } = target;
    let validatedValue;

    if (!validity.valid) {
      clearTimeout(timeoutId.current);
      validatedValue = form[name];
      setWarnForm({
        [name]:
          pattern === regex.name
            ? "Breed name only accepts letters and whitespaces"
            : "Only numbers allowed",
      });
      timeout = () => setTimeout(() => setWarnForm({}), 5000);
      timeoutId.current = timeout();
    } else {
      validatedValue = value;
    }

    //let validatedValue = validity.valid ? value : form[name];

    if (name === "temperaments") {
      if (temperaments.includes(value)) {
        setForm({
          ...form,
          [name]: temperaments.filter((temperament) => temperament !== value),
        });
      } else if (value && temperaments.length < 5) {
        setForm({
          ...form,
          [name]: [...temperaments, value],
        });
      } else if (temperaments.length === 5) {
        setWarnForm({
          [name]: "5 temperaments can be selected at most",
        });
        clearTimeout(timeoutId.current);
        timeout = () => setTimeout(() => setWarnForm({}), 5000);
        timeoutId.current = timeout();
      }
      /* } else if (name === "newTemperament") {
      validatedValue = validity.valid ? value : newTemperament;
      setNewTemperament(validatedValue); */
    } else if (type === "text") {
      setForm({
        ...form,
        [name]: validatedValue,
      });
    }
    setErrors(validateForm());
  };

  const handleBlur = (e) => {
    clearTimeout(timeoutId.current);
    setErrors(validateForm());
    setWarnForm({});
    setFocusInfo({
      ...focusInfo,
      [e.target.name]: false,
    });
  };

  const handleReset = () => {
    setForm(initialForm);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowErrors(true);
    setErrors(validateForm());
    if (Object.keys(errors).length === 0 && !Object.values(form).includes("")) {
      setLoading(true);
      let temperamentsToString = "";

      for (let i = 0; i < temperaments.length; i++) {
        i === 0
          ? (temperamentsToString = `${temperaments[i]}`)
          : (temperamentsToString = `${temperamentsToString}, ${temperaments[i]}`);
      }

      newDog.current = {
        name,
        height: { metric: `${min_height} - ${max_height}` },
        weight: { metric: `${min_weight} - ${max_weight}` },
        life_span: `${life_span} years`,
        temperament: temperamentsToString,
      };
      if (Object.keys(dogToUpdate).length) {
        const updatedDog = {};
        if (dogToUpdate.name !== newDog.current.name)
          updatedDog.name = newDog.current.name;
        if (dogToUpdate.height.metric !== newDog.current.height.metric)
          updatedDog.height = { metric: newDog.current.height.metric };
        if (dogToUpdate.weight.metric !== newDog.current.weight.metric)
          updatedDog.weight = { metric: newDog.current.weight.metric };
        if (dogToUpdate.life_span !== newDog.current.life_span)
          updatedDog.life_span = newDog.current.life_span;
        if (dogToUpdate.temperament !== newDog.current.temperament)
          updatedDog.temperament = newDog.current.temperament;

        if (Object.keys(updatedDog).length) {
          axios
            .put(`${URL}${dogToUpdate.id}`, updatedDog)
            .then((res) => {
              handleReset();
              //  setResponse(true);
              //  setTimeout(() => setResponse(false), 5000);
              setShowErrors(false);
              setErrors(validateForm());
              dispatch(editDog(res.data));
              openModalEditSuccess();
              timeout = () => setTimeout(() => navigate("/home"), 5000);
              timeoutId.current = timeout();
            }) //!VENTANA MODAL, crear nuevo estado para informar esto, setResponse
            .catch((err) => {
              if (err.response) {
                setErrorEdit(`${err.message}: ${err.response.statusText}`);
              } else if (err.request) {
                setErrorEdit("Server does not respond");
              } else {
                setErrorEdit("Error " + err.message);
              }
              openModalEditFail();
            }) //!VENTANA MODAL, crear nuevo estado para informar esto, setResponse
            .finally(() => setLoading(false));
        } else {
          openModalEditSame();
          setLoading(false);
        }
      } else {
        axios
          .post(URL, newDog.current)
          .then((res) => {
            handleReset();
            //   setResponse(true);
            //   setTimeout(() => setResponse(false), 5000);
            setShowErrors(false);
            setErrors(validateForm());
            dispatch(createDog(res.data));
            openModalCreateSuccess();
          }) //!VENTANA MODAL, crear nuevo estado para informar esto, setResponse
          .catch((err) => {
            if (err.response) {
              setErrorCreate(`${err.message}: ${err.response.statusText}`);
            } else if (err.request) {
              setErrorCreate("Server does not respond");
            } else {
              setErrorCreate("Error " + err.message);
            }
            openModalCreateFail();
          }) //!VENTANA MODAL, crear nuevo estado para informar esto, setResponse
          .finally(() => setLoading(false));
      }
    }
  };

  /*   const customTemperament = () => {
    setAddTemperament(!addTemperament);
  }; */

  useEffect(() => {
    setLoading(true);
    const editDogData = sessionStorage.getItem("editDogData");
    editDogData || setDogToUpdate({});

    axios
      .get(URL)
      .then(({ data: dogs }) => {
        allTemperaments.current = [];
        let dogTemperaments;
        for (const dog of dogs) {
          dog.temperament &&
            (dogTemperaments = dog.temperament.replace(/,/g, "").split(" "));
          for (const temperament of dogTemperaments) {
            allTemperaments.current.includes(temperament) ||
              allTemperaments.current.push(temperament);
          }
        }
        allTemperaments.current.sort();
        //allTemperaments.current.unshift("Add custom temperament");
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

    if (editDogData) {
      let dogTemperaments = dogDetails.temperament.replace(/,/g, "").split(" ");
      let dogHeight = dogDetails.height.metric.replace(/ /g, "").split("-");
      let dogWeight = dogDetails.weight.metric.replace(/ /g, "").split("-");

      setForm({
        name: dogDetails.name,
        min_height: dogHeight[0],
        max_height: dogHeight[1],
        min_weight: dogWeight[0],
        max_weight: dogWeight[1],
        life_span: dogDetails.life_span.replace(/ years/, ""),
        temperaments: dogTemperaments,
      });
    }

    return () => {
      clearTimeout(timeoutId.current);
      setWarnForm({});
      sessionStorage.removeItem("editDogData");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setErrors(validateForm());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  return (
    <>
      {error ? (
        <Error message={error} />
      ) : (
        <>
          <h1>{sessionStorage.getItem("editDogData") ? "EDIT" : "CREATE"}</h1>
          <form onSubmit={handleSubmit}>
            <>
              {focusInfo.name && <label>Enter the breed name</label>}
              <input
                type="text"
                name="name"
                placeholder="Breed name"
                pattern={regex.name}
                onBlur={handleBlur}
                onChange={handleChange}
                onFocus={handleFocus}
                value={name}
                autoComplete="off"
              />
              {warnForm.name && <p>{warnForm.name}</p>}
              {showErrors && errors.name && <p>{errors.name}</p>} <br />
              <br />
              {arrForRender.map((inputName) => (
                <div key={inputName}>
                  {focusInfo[inputName] && (
                    <label>
                      Enter the{" "}
                      {inputName
                        .replace("_", " ")
                        .replace("min", "minimum")
                        .replace("max", "maximum")}
                    </label>
                  )}
                  <input
                    type="text"
                    name={inputName}
                    placeholder={
                      inputName.charAt(0).toUpperCase() +
                      inputName.slice(1).replace("_", " ")
                    }
                    pattern={regex.number}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    value={form[inputName]}
                    autoComplete="off"
                  />
                  {inputName.includes("height") ? (
                    <span>cms.</span>
                  ) : inputName.includes("weight") ? (
                    <span>kgs.</span>
                  ) : (
                    <span>years</span>
                  )}
                  {warnForm[inputName] && <p>{warnForm[inputName]}</p>}
                  {showErrors && errors[inputName] && (
                    <p>{errors[inputName]}</p>
                  )}
                  <br />
                  <br />
                </div>
              ))}
            </>
            {loading ? (
              <Loader />
            ) : (
              <>
                <label>
                  Temperaments
                  {focusInfo.temperaments && (
                    <label>
                      Select at least one and at most 5 temperaments
                    </label>
                  )}
                  <select
                    name="temperaments"
                    multiple
                    size="12"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    onFocus={handleFocus}
                  >
                    {allTemperaments.current.map((temperament) => (
                      <option value={temperament} key={temperament}>
                        {temperament}
                      </option>
                    ))}
                  </select>
                </label>
                {temperaments.length > 0 &&
                  temperaments.map((temperament) => (
                    <div key={temperament}>
                      <h4>{temperament}</h4>
                      <span onClick={() => deleteTemperament(temperament)}>
                        x
                      </span>
                    </div>
                  ))}
                {warnForm.temperaments && <p>{warnForm.temperaments}</p>}
                {showErrors && errors.temperaments && (
                  <p>{errors.temperaments}</p>
                )}
                <br />
                <>
                  {/* <button onClick={customTemperament}>Add custom temperament</button>
            {addTemperament && (
              <input
              type="text"
              name="newTemperament"
              placeholder="Enter new temperament"
              pattern={regex.name}
                onBlur={handleBlur}
                onChange={handleChange}
                value={newTemperament}
                />
              )} */}
                  {/* {temperaments.includes("Add custom temperament") && (
              <input
              type="text"
                name="newTemperament"
                placeholder="Enter new temperament"
                pattern={regex.name}
                onBlur={handleBlur}
                onChange={handleChange}
                value={newTemperament}
                />
              )} */}
                </>
              </>
            )}
            <input
              type="submit"
              value={
                sessionStorage.getItem("editDogData")
                  ? "Edit breed"
                  : "Create breed"
              }
            />
            <button onClick={handleReset}>Reset</button>
            {/* response && <h1>FORMULARIO ENVIADO</h1> */}
          </form>
        </>
      )}
      <span onClick={() => navigate("/home")}>
        <Modal isOpen={isOpenEditSuccess} closeModal={closeModalEditSuccess}>
          <p>{`${dogToUpdate.name} edited successfully`}</p>
          <p>Returning to Home</p>
        </Modal>
      </span>
      <Modal isOpen={isOpenEditFail} closeModal={closeModalEditFail}>
        <p>{`Failed to edit ${dogToUpdate.name}`}</p>
        <p>{`${errorEdit}`}</p>
        <button onClick={handleSubmit}>Try again</button>
        <button onClick={closeModalEditFail}>Cancel</button>
      </Modal>
      <Modal isOpen={isOpenEditSame} closeModal={closeModalEditSame}>
        <p>{dogToUpdate.name} has the same properties</p>
        <button onClick={closeModalEditSame}>Accept</button>
      </Modal>
      <Modal isOpen={isOpenCreateSuccess} closeModal={closeModalCreateSuccess}>
        <p>{`${newDog.current.name} created successfully`}</p>
        <button onClick={closeModalCreateSuccess}>Create another breed</button>
        <button onClick={() => navigate("/home")}>Return Home</button>
      </Modal>
      <Modal isOpen={isOpenCreateFail} closeModal={closeModalCreateFail}>
        <p>{`Failed to create ${newDog.current.name}`}</p>
        <p>{`${errorCreate}`}</p>
        <button onClick={handleSubmit}>Try again</button>
        <button onClick={closeModalCreateFail}>Cancel</button>
      </Modal>
    </>
  );
};

export default CreateDog;
