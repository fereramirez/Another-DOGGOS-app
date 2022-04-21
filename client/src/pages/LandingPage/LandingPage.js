import { Link } from "react-router-dom";
import "./LandingPage.css";

const LandingPage = () => {
  return (
    <div className="landing-container">
      <h1 className="title"> My first project</h1>
      <button className="boton-start">
        <Link to="/home">Let's get started</Link>
      </button>
    </div>
  );
};

export default LandingPage;
