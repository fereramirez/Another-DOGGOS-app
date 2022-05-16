import "./Error.css";
import cheems from "../Assets/cheems.png";

const Error = ({ message }) => {
  return (
    <div className="error-search-container a">
      <h1>{message}</h1>
      <img src={cheems} alt="Cheems" />
    </div>
  );
};

export default Error;
