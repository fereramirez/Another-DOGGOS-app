import { useEffect, useRef, useState } from "react";
import Loader from "../../components/Loader";
import { URL } from "../../Constants";

//const { REACT_APP_API_KEY } = process.env;

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
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [focusInfo, setFocusInfo] = useState(initialFocusInfo);
  const [warnForm, setWarnForm] = useState({});
  const [errors, setErrors] = useState({});
  const [showErrors, setShowErrors] = useState(false);
  // const [addTemperament, setAddTemperament] = useState(false);
  // const [newTemperament, setNewTemperament] = useState("");
  let allTemperaments = useRef([]);
  let warnTimeout;
  let warnTimeoutId = useRef();

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
    if (parseInt(min_height) > parseInt(max_height))
      error.min_height = "Min height can not be higher than max height";
    if (!min_weight) error.min_weight = "Minimum weight is empty";
    if (!max_weight) error.max_weight = "Maximum weight is empty";
    if (parseInt(min_weight) > parseInt(max_weight))
      error.min_weight = "Min weight can not be higher than max weight";
    if (!life_span) error.life_span = "Life span is empty";

    /* if (temperaments.length < 1 || temperaments.length > 5)
      error.temperaments = "No temperaments selected or created"; */

    return error;
  };

  const handleFocus = (e) => {
    setFocusInfo({
      ...focusInfo,
      [e.target.name]: true,
    });
  };

  const handleChange = ({ target }) => {
    const { name, value, type, validity, pattern } = target;
    let validatedValue;

    if (!validity.valid) {
      clearTimeout(warnTimeoutId.current);
      validatedValue = form[name];
      setWarnForm({
        [name]:
          pattern === regex.name
            ? "Breed name only accepts letters and whitespaces"
            : "Only numbers allowed",
      });
      warnTimeout = () => setTimeout(() => setWarnForm({}), 5000);
      warnTimeoutId.current = warnTimeout();
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
        setWarnForm({});
      } else if (value && temperaments.length < 5) {
        setForm({
          ...form,
          [name]: [...temperaments, value],
        });
      } else if (temperaments.length === 5) {
        setWarnForm({
          [name]: "5 temperaments can be selected at most",
        });
        setTimeout(() => setWarnForm({}), 5000);
      }
      console.log(temperaments);
      console.log(value);
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
      handleReset();
      setLoading(false);
      setResponse(true);
      setTimeout(() => setResponse(false), 5000);
      setShowErrors(false);
      setErrors(validateForm());
    }
  };

  /*   const customTemperament = () => {
    setAddTemperament(!addTemperament);
  }; */

  useEffect(() => {
    setLoading(true);

    fetch(`${URL}`)
      .then((res) => res.json())
      .then((dogs) => {
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
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    setErrors(validateForm());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  return (
    <>
      <h1>CREATE</h1>
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
              {warnForm[inputName] && <p>{warnForm[inputName]}</p>}
              {showErrors && errors[inputName] && <p>{errors[inputName]}</p>}
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
                <label>Select at least one and at most 5 temperaments</label>
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
                <h4 key={temperament}>{temperament}</h4>
              ))}
            {warnForm.temperaments && <p>{warnForm.temperaments}</p>}
            {showErrors && errors.temperaments && <p>{errors.temperaments}</p>}
            <br />
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
        )}
        <input type="submit" value="Create breed" />
        <button onClick={handleReset}>Reset</button>
        {response && <h1>FORMULARIO ENVIADO</h1>}
      </form>
    </>
  );
};

export default CreateDog;
