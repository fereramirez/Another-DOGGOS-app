import { Link, useLocation } from "react-router-dom";
import SearchBar from "../pages/Home/SearchBar";
import "./NavBar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookmark,
  faDog,
  faHouseChimney,
  faPencil,
  faQuestion,
  /* faScroll, */
} from "@fortawesome/free-solid-svg-icons";

const NavBar = () => {
  let location = useLocation();
  const { pathname } = location;

  return (
    <>
      <header className="nav-container fixed">
        <span className="logo">
          <FontAwesomeIcon icon={faDog} />
        </span>
        <ul className="menu-routes">
          <li
            className={`one-route-container ${
              pathname === "/home" ? "over home" : ""
            }`}
          >
            <Link to="/home">
              {pathname === "/home" ? (
                <>
                  <span className="current-route">
                    <FontAwesomeIcon icon={faBookmark} />
                    <FontAwesomeIcon icon={faHouseChimney} />
                  </span>
                </>
              ) : (
                <>
                  <span className="route">HOME</span>
                  <span className="route-icon">
                    <FontAwesomeIcon icon={faHouseChimney} />
                  </span>
                </>
              )}
            </Link>
          </li>
          <li
            className={`one-route-container ${
              pathname === "/createdog" ? "over" : ""
            }`}
          >
            <Link to="/createdog">
              {pathname === "/createdog" ? (
                <>
                  <span className="current-route">
                    <FontAwesomeIcon icon={faBookmark} />
                    <FontAwesomeIcon icon={faPencil} />
                  </span>
                </>
              ) : (
                <>
                  <span className="route">CREATE</span>
                  <span className="route-icon">
                    <FontAwesomeIcon icon={faPencil} />
                  </span>
                </>
              )}
            </Link>
          </li>
          <li
            className={`one-route-container ${
              pathname === "/about" ? "over about" : ""
            }`}
          >
            <Link to="/about">
              {pathname === "/about" ? (
                <>
                  <span className="current-route">
                    <FontAwesomeIcon icon={faBookmark} />
                    <FontAwesomeIcon icon={faQuestion} />
                  </span>
                </>
              ) : (
                <>
                  <span className="route">ABOUT</span>
                  <span className="route-icon">
                    <FontAwesomeIcon icon={faQuestion} />
                  </span>
                </>
              )}
            </Link>
          </li>
        </ul>
        <SearchBar />
      </header>
    </>
  );
};

export default NavBar;
