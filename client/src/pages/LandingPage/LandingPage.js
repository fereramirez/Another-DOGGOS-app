import { Link } from "react-router-dom";
import "./LandingPage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faPaw } from "@fortawesome/free-solid-svg-icons";
import videoDesktop from "../../Assets/dogs-walking.mp4";
import videoMobile from "../../Assets/dogs-stick.mp4";
import { useEffect, useState } from "react";

const LandingPage = () => {
  const [width, setWidth] = useState(window.innerWidth);

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }
  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  const isMobile = width <= 700;

  return (
    <>
      {isMobile ? (
        <video className="landing-video" autoPlay loop muted>
          <source src={videoMobile} type="video/mp4" />
        </video>
      ) : (
        <video className="landing-video" autoPlay loop muted>
          <source src={videoDesktop} type="video/mp4" />
        </video>
      )}
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
      </div>
    </>
  );
};

export default LandingPage;
