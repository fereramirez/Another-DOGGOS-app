import { useEffect, useRef, useState } from "react";
import Loader from "../../components/Loader";

const { REACT_APP_API_KEY } = process.env;

const initialForm = {
  name: "",
  minheight: "",
  maxheight: "",
  minweight: "",
  maxweight: "",
  lifespan: "",
  temperaments: [],
};

const regex = {
  name: "^[A-Za-zÑñÁáÉéÍíÓóÚúÜüs ]+$",
  number: "[0-9]*",
};

const CreateDog = () => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [addTemperament, setAddTemperament] = useState(false);
  const [newTemperament, setNewTemperament] = useState("");
  let allTemperaments = useRef([]);

  const {
    name,
    minheight,
    maxheight,
    minweight,
    maxweight,
    lifespan,
    temperaments,
  } = form;

  const validateForm = () => {
    let error = {};

    if (!name.trim()) {
      error.name = "Enter the breed name";
    } else if (!minheight) {
      error.minheight = "Enter the min height";
    } else if (!maxheight) {
      error.maxheight = "Enter the max height";
    } else if (parseInt(minheight) > parseInt(maxheight)) {
      error.minheight = "Min height can not be higher than max height";
    } else if (!minweight) {
      error.minweight = "Enter the min weight";
    } else if (!maxweight) {
      error.maxweight = "Enter the max weight";
    } else if (parseInt(minweight) > parseInt(maxweight)) {
      error.minweight = "Min weight can not be higher than max weight";
    } else if (!lifespan) {
      error.lifespan = "Life span is empty";
    }
    return error;
  };

  const handleChange = (e) => {
    let value = e.target.validity.valid ? e.target.value : form[e.target.name];

    if (e.target.name === "temperaments") {
      temperaments.includes(e.target.value)
        ? setForm({
            ...form,
            [e.target.name]: temperaments.filter(
              (temperament) => temperament !== e.target.value
            ),
          })
        : setForm({
            ...form,
            [e.target.name]: [...temperaments, e.target.value],
          });
    } else if (e.target.name === "newTemperament") {
      value = e.target.validity.valid ? e.target.value : newTemperament;
      setNewTemperament(value);
    } else {
      setForm({
        ...form,
        [e.target.name]: value,
      });
    }
  };

  const handleBlur = (e) => {
    setErrors(validateForm(form));
  };

  const handleReset = () => {
    setForm(initialForm);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors(validateForm(form));
    //handleReset();
  };

  const customTemperament = () => {
    setAddTemperament(!addTemperament);
  };

  useEffect(() => {
    setLoading(true);
    fetch(`https://api.thedogapi.com/v1/breeds`, {
      headers: { "x-api-key": `${REACT_APP_API_KEY}` },
    })
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
        allTemperaments.current.unshift("Add custom temperament");
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <h1>CREATE</h1>
      <form onSubmit={handleSubmit}>
        <>
          <input
            type="text"
            name="name"
            placeholder="Breed name"
            pattern={regex.name}
            onBlur={handleBlur}
            onChange={handleChange}
            value={name}
          />
          {errors.name && <p>{errors.name}</p>} <br />
          <br />
          <input
            type="text"
            name="minheight"
            placeholder="Min height"
            pattern={regex.number}
            onBlur={handleBlur}
            onChange={handleChange}
            value={minheight}
          />
          {errors.minheight && <p>{errors.minheight}</p>} <br />
          <br />
          <input
            type="text"
            name="maxheight"
            placeholder="Max height"
            pattern={regex.number}
            onBlur={handleBlur}
            onChange={handleChange}
            value={maxheight}
          />
          {errors.maxheight && <p>{errors.maxheight}</p>} <br />
          <br />
          <input
            type="text"
            name="minweight"
            placeholder="Min weight"
            pattern={regex.number}
            onBlur={handleBlur}
            onChange={handleChange}
            value={minweight}
          />
          {errors.minweight && <p>{errors.minweight}</p>} <br />
          <br />
          <input
            type="text"
            name="maxweight"
            placeholder="Max weight"
            pattern={regex.number}
            onBlur={handleBlur}
            onChange={handleChange}
            value={maxweight}
          />
          {errors.maxweight && <p>{errors.maxweight}</p>} <br />
          <br />
          <input
            type="text"
            name="lifespan"
            placeholder="Life span"
            pattern={regex.number}
            onBlur={handleBlur}
            onChange={handleChange}
            value={lifespan}
          />
          {errors.lifespan && <p>{errors.lifespan}</p>} <br />
          <br />
        </>
        {loading ? (
          <Loader />
        ) : (
          <>
            <select
              name="temperaments"
              multiple
              size="12"
              onChange={handleChange}
              value={temperaments}
            >
              {allTemperaments.current.map((temperament) => (
                <option value={temperament} key={temperament}>
                  {temperament}
                </option>
              ))}
            </select>
            <button onClick={customTemperament}>Add custom temperament</button>
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
            )}
            {/* temperaments.includes("Add custom temperament") && (
              <input
                type="text"
                name="newTemperament"
                placeholder="Enter new temperament"
                pattern={regex.name}
                onBlur={handleBlur}
                onChange={handleChange}
                value={newTemperament}
              />
            ) */}
          </>
        )}
        <input type="submit" value="Create breed" />
        <button onClick={handleReset}>Reset</button>
      </form>
    </>
  );
};

export default CreateDog;
