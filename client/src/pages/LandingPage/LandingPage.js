import { Link } from "react-router-dom";
import "./LandingPage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faPaw } from "@fortawesome/free-solid-svg-icons";
import video from "../../Assets/dogs-playing.mp4";

const LandingPage = () => {
  return (
    <div className="landing-container">
      <Link to="/home">
        <span className="landing-paw">
          <FontAwesomeIcon icon={faPaw} />
        </span>
      </Link>
      <div className="triangle">
        <p className="landing-text">Another DOGOS app</p>
        <p className="landing-start">
          Click{" "}
          <span>
            <span>H</span>
            <span>E</span>
            <span>R</span>
            <span>E</span>
          </span>{" "}
          to start!
        </p>
      </div>
      <video id="background-video" autoPlay loop muted>
        <source src={video} type="video/mp4" />
      </video>
    </div>
  );
};

export default LandingPage;
