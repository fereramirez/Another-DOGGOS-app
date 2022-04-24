import { useState } from "react";

const initialForm = {
  name: "",
  minheight: "",
  maxheight: "",
  minweight: "",
  maxweight: "",
  lifespan: "",
  temperaments: "",
};

const CreateDog = () => {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const {
    name,
    minheight,
    maxheight,
    minweight,
    maxweight,
    lifespan,
    temperaments,
  } = form;

  const validateForm = (form) => {
    let error = {};
    let regexName = /^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+$/;

    if (!name.trim()) {
      error.name = "Enter the breed name";
    } else if (!regexName.test(name.trim())) {
      error.name = "The breed name only accept letters";
    } else if (!minheight) {
      error.minheight = "Enter the min height";
    } else if (!maxheight) {
      error.maxheight = "Enter the max height";
    } else if (minheight > maxheight) {
      error.minheight = "Min height can not be higher than max height";
    } else if (!minweight) {
      error.minweight = "Enter the min weight";
    } else if (!maxweight) {
      error.maxweight = "Enter the max weight";
    } else if (minweight > maxweight) {
      error.minweight = "Min weight can not be higher than max weight";
    } else if (!lifespan) {
      error.lifespan = "Life span is empty";
    }
    return error;
  };

  const handleChange = (e) => {
    /* if (e.target.type === "number" && typeof e.target.value !== "number") {
      e.target.value = null;
    } */
    console.log(e.target.value);
    if (e.target.type === "number" && e.target.value > 0) {
      setForm({
        ...form,
        [e.target.name]: e.target.value,
      });
    }
    if (e.target.type === "text") {
      setForm({
        ...form,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleBlur = (e) => {
    setErrors(validateForm(form));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setForm(initialForm);
  };

  return (
    <>
      <h1>CREATE</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Breed name"
          onBlur={handleBlur}
          onChange={handleChange}
          value={form.name}
          required
        />
        {errors.name && <p>{errors.name}</p>}
        <input
          type="number"
          name="minheight"
          placeholder="Min height"
          onBlur={handleBlur}
          onChange={handleChange}
          value={form.minheight}
          required
        />
        {errors.minheight && <p>{errors.minheight}</p>}
        <input
          type="number"
          name="maxheight"
          placeholder="Max height"
          onBlur={handleBlur}
          onChange={handleChange}
          value={form.maxheight}
          required
        />
        {errors.maxheight && <p>{errors.maxheight}</p>}
        <input
          type="number"
          name="minweight"
          placeholder="Min weight"
          onBlur={handleBlur}
          onChange={handleChange}
          value={form.minweight}
          required
        />
        {errors.minweight && <p>{errors.minweight}</p>}
        <input
          type="number"
          name="maxweight"
          placeholder="Max weight"
          onBlur={handleBlur}
          onChange={handleChange}
          value={form.maxweight}
          required
        />
        {errors.maxweight && <p>{errors.maxweight}</p>}
        <input
          type="number"
          name="lifespan"
          placeholder="Life span"
          onBlur={handleBlur}
          onChange={handleChange}
          value={form.lifespan}
          required
        />
        {errors.lifespan && <p>{errors.lifespan}</p>}
        {/* <select
          name="temperaments"
          multiple
          size="12"
          value={form.temperaments}
          required
        >
          <option value="asd">asdasd</option>
          <option value="dfg">dfgdfg</option>
          <option value="yuk">yukyuk</option>
        </select> */}
        <input type="submit" value="Create breed" />
      </form>
    </>
  );
};

export default CreateDog;
