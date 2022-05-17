import React, { useEffect, useRef, useState } from "react";
import Loader from "../../components/Loader";
import Error from "../../components/Error";
import { URL } from "../../Constants";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createDog, editDog } from "../../Redux/actions";
import Modal from "../../components/Modal";
import { useModal } from "../../hooks/useModal";
import "./CreateDog.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";

const initialForm = {
  name: "",
  min_height: "",
  max_height: "",
  min_weight: "",
  max_weight: "",
  life_span: "",
  temperaments: [],
};

/* const initialFocusInfo = {
  name: false,
  min_height: false,
  max_height: false,
  min_weight: false,
  max_weight: false,
  life_span: false,
  temperaments: false,
}; */
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
  /*   const [focusInfo, setFocusInfo] = useState(initialFocusInfo); */
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
    /*  if (Object.keys(dogToUpdate).length === 0)
      setFocusInfo({
        ...focusInfo,
        [e.target.name]: true,
      }); */
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
            ? "Only letters allowed"
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
    /* if (Object.keys(dogToUpdate).length === 0)
      setFocusInfo({
        ...focusInfo,
        [e.target.name]: false,
      }); */
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
            })
            .catch((err) => {
              if (err.response) {
                setErrorEdit(`${err.message}: ${err.response.data}`);
              } else if (err.request) {
                setErrorEdit("Server does not respond");
              } else {
                setErrorEdit("Error " + err.message);
              }
              openModalEditFail();
            })
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
          })
          .catch((err) => {
            if (err.response) {
              setErrorCreate(`${err.message}: ${err.response.data}`);
            } else if (err.request) {
              console.log("2");
              setErrorCreate("Server does not respond");
            } else {
              console.log("3");
              setErrorCreate("Error " + err.message);
            }
            openModalCreateFail();
          })
          .finally(() => setLoading(false));
      }
    }
  };

  /*   const customTemperament = () => {
    setAddTemperament(!addTemperament);
  }; */

  useEffect(() => {
    setLoading(true);
    /*  if (Object.keys(dogToUpdate).length) {
      setFocusInfo({
        name: true,
        min_height: true,
        max_height: true,
        min_weight: true,
        max_weight: true,
        life_span: true,
        temperaments: true,
      });
    } */
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
          err.response.data
            ? setError(`${err.message}: ${err.response.data}`)
            : setError(err.message);
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

    window.onbeforeunload = function () {
      sessionStorage.clear();
    };

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

  const [isItMobile, setIsItMobile] = useState(null);
  useEffect(() => {
    let mobileCheck = (window.mobileCheck = function () {
      let check = false;
      (function (a) {
        if (
          /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(
            a
          ) ||
          /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
            a.substr(0, 4)
          )
        )
          check = true;
      })(navigator.userAgent || navigator.vendor || window.opera);
      return check;
    })();
    setIsItMobile(mobileCheck);
  }, []);

  const enterHandler = (e) => {
    if (e.keyCode === 13 && temperamentMobile) {
      if (temperaments.includes(temperamentMobile)) {
        setForm({
          ...form,
          [e.target.name]: temperaments.filter(
            (temperament) => temperament !== temperamentMobile
          ),
        });
      } else if (temperamentMobile && temperaments.length < 5) {
        console.log(e);
        console.log(temperamentMobile);
        setForm({
          ...form,
          temperaments: [...temperaments, temperamentMobile],
        });
      } else if (temperaments.length === 5) {
        setWarnForm({
          [e.target.name]: "5 temperaments can be selected at most",
        });
        clearTimeout(timeoutId.current);
        timeout = () => setTimeout(() => setWarnForm({}), 5000);
        timeoutId.current = timeout();
      }
      setTemperamentMobile("");
    }
  };
  const [temperamentMobile, setTemperamentMobile] = useState("");

  const handleTemperamentsMobile = ({ target }) => {
    const { name, value, validity } = target;
    let validatedValue = "";

    if (!validity.valid) {
      clearTimeout(timeoutId.current);
      setWarnForm({
        [name]: "Only letters allowed",
      });
      timeout = () => setTimeout(() => setWarnForm({}), 5000);
      timeoutId.current = timeout();
    } else {
      validatedValue = value;
    }
    setTemperamentMobile(validatedValue);
  };

  return (
    <div className="create-container">
      {error ? (
        <div className="dumb-for-error">
          <Error message={error} />
        </div>
      ) : loading ? (
        <Loader />
      ) : (
        <div className="create-content-container">
          <h1>
            {sessionStorage.getItem("editDogData")
              ? "EDIT BREED"
              : "CREATE YOUR BREED"}
          </h1>
          <form
            onSubmit={handleSubmit}
            onReset={handleReset}
            className="create-form"
          >
            <>
              <label>Breed name</label>
              <div>
                {warnForm.name ? (
                  <p className="warn-info">{warnForm.name}</p>
                ) : (
                  <p className="hidden-dumb">HIDDEN</p>
                )}
                <input
                  type="text"
                  name="name"
                  /* placeholder="Breed name" */
                  pattern={regex.name}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  onFocus={handleFocus}
                  value={name}
                  autoComplete="off"
                  className="input-without-metric"
                />

                <p
                  className={`error-info ${
                    showErrors && errors.name ? "" : "error-hidden"
                  }`}
                >
                  {errors.name ? errors.name : "HIDDEN"}
                </p>

                {/* {showErrors ? (
                  <p
                    className={`error-info ${
                      showErrors && errors.hasOwnProperty(name)
                        ? "error-showed"
                        : "error-hidden"
                    }`}
                  >
                    {errors.hasOwnProperty(name) ? errors.name : " asd"}
                  </p>
                ) : (
                  <p className="hidden-dumb">HIDDEN</p>
                )} */}
              </div>
              {React.Children.toArray(
                arrForRender.map((inputName) => (
                  <>
                    <label>
                      {inputName.charAt(0).toUpperCase() +
                        inputName
                          .slice(1)
                          .replace("_", " ")
                          .replace("in", "inimum")
                          .replace("ax", "aximum")}
                    </label>
                    <div>
                      {warnForm[inputName] ? (
                        <p className="warn-info">{warnForm[inputName]}</p>
                      ) : (
                        <p className="hidden-dumb">HIDDEN</p>
                      )}
                      <input
                        type="text"
                        name={inputName}
                        /* placeholder={
                          inputName.charAt(0).toUpperCase() +
                          inputName.slice(1).replace("_", " ")
                        } */
                        pattern={regex.number}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        onFocus={handleFocus}
                        value={form[inputName]}
                        autoComplete="off"
                        className="input-with-metric"
                      />
                      {inputName.includes("height") ? (
                        <span>cms.</span>
                      ) : inputName.includes("weight") ? (
                        <span>kgs.</span>
                      ) : (
                        <span>years</span>
                      )}
                      <p
                        className={`error-info ${
                          showErrors && errors[inputName] ? "" : "error-hidden"
                        }`}
                      >
                        {errors[inputName] ? errors[inputName] : "HIDDEN"}
                      </p>
                    </div>
                  </>
                ))
              )}
            </>

            <>
              <label className="temperament-info c temperament-info-mobile-container">
                Temperaments
                <p
                  className={`error-info ${
                    showErrors && errors.temperaments ? "" : "error-hidden"
                  }`}
                >
                  {errors.temperaments
                    ? errors.temperaments
                    : "No temperaments selected"}
                </p>
                <div className="temperament-selected-container">
                  {temperaments.length > 0 &&
                    temperaments.map((temperament) => (
                      <div key={temperament}>
                        <h4 className="temperament-selected">
                          {temperament}
                          <span
                            onClick={() => deleteTemperament(temperament)}
                            className="x-mark-temperament"
                          >
                            {" "}
                            <FontAwesomeIcon icon={faXmark} />
                          </span>
                        </h4>
                      </div>
                    ))}
                </div>
                {warnForm.temperaments ? (
                  <p className="warn-info temperament-warn">
                    {warnForm.temperaments}
                  </p>
                ) : (
                  <p className="hidden-dumb temperament-warn">
                    5 temperaments can be selected at most
                  </p>
                )}
              </label>

              <div
                className={`d ${
                  isItMobile ? "select-temperaments-mobile-container n" : ""
                }`}
              >
                {isItMobile ? (
                  <span>
                    <input
                      name="temperaments"
                      pattern={regex.name}
                      list="allTemperaments"
                      onBlur={handleBlur}
                      onChange={handleTemperamentsMobile}
                      onKeyUp={enterHandler}
                      onFocus={handleFocus}
                      className="select-temperaments-mobile"
                      autoComplete="off"
                      value={temperamentMobile}
                      placeholder="Tap HERE to select"
                    />
                    <datalist id="allTemperaments">
                      {allTemperaments.current.map((temperament) => (
                        <option value={temperament} key={temperament} />
                      ))}
                    </datalist>
                  </span>
                ) : (
                  <select
                    name="temperaments"
                    multiple
                    size="12"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    onFocus={handleFocus}
                    className="select-temperaments"
                  >
                    {allTemperaments.current.map((temperament) => (
                      <option value={temperament} key={temperament}>
                        {temperament}
                      </option>
                    ))}
                  </select>
                )}
              </div>
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

            <div
              className={`buttons-create-container ${
                isItMobile ? "buttons-create-container-mobile  n" : "p"
              }`}
            >
              <input
                type="submit"
                value={
                  sessionStorage.getItem("editDogData")
                    ? "Edit breed"
                    : "Create breed"
                }
                className="button-form submit-form"
              />
              <input
                type="reset"
                value="Reset"
                className="button-form reset-form"
              />
            </div>
          </form>
        </div>
      )}

      <span onClick={() => navigate("/home")}>
        <Modal
          isOpen={isOpenEditSuccess}
          closeModal={closeModalEditSuccess}
          type="success"
        >
          <p>{`${dogToUpdate.name} edited successfully`}</p>
          <p>Returning to Home</p>
        </Modal>
      </span>
      <Modal
        isOpen={isOpenEditFail}
        closeModal={closeModalEditFail}
        type="error"
      >
        <p>{`Failed to edit ${dogToUpdate.name}`}</p>
        <p>{`${errorEdit}`}</p>
        <button onClick={closeModalEditFail}>Accept</button>
      </Modal>
      <Modal
        isOpen={isOpenEditSame}
        closeModal={closeModalEditSame}
        type="warn"
      >
        <p>{dogToUpdate.name} has the same properties</p>
        <button onClick={closeModalEditSame}>Accept</button>
      </Modal>
      <Modal
        isOpen={isOpenCreateSuccess}
        closeModal={closeModalCreateSuccess}
        type="success"
      >
        <p>{`${newDog.current.name} created successfully`}</p>
        <button onClick={closeModalCreateSuccess}>Create another breed</button>
        <button onClick={() => navigate("/home")}>Return Home</button>
      </Modal>
      <Modal
        isOpen={isOpenCreateFail}
        closeModal={closeModalCreateFail}
        type="error"
      >
        <p>{`Failed to create ${newDog.current.name}`}</p>
        <p>{`${errorCreate}`}</p>
        <button onClick={closeModalCreateFail}>Accept</button>
      </Modal>
    </div>
  );
};

export default CreateDog;
