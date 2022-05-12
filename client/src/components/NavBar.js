import { Link } from "react-router-dom";
import SearchBar from "../pages/Home/SearchBar";
import "./NavBar.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouseChimney,
  faPencil,
  faScroll,
} from "@fortawesome/free-solid-svg-icons";

const NavBar = () => {
  return (
    <>
      <header className="nav-container fixed">
        <Link to="/home">
          <span className="routes">HOME</span>
          <FontAwesomeIcon icon={faHouseChimney} />
        </Link>
        <Link to="/createdog">
          <span className="routes">CREATE</span>
          <FontAwesomeIcon icon={faPencil} />
        </Link>
        <Link to="/about">
          <span className="routes">ABOUT</span>
          <FontAwesomeIcon icon={faScroll} />
        </Link>
        <SearchBar />
      </header>
    </>
  );
};

export default NavBar;
