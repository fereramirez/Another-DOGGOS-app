import { Link } from "react-router-dom";
import SearchBar from "../pages/Home/SearchBar";
import "./NavBar.css";

const NavBar = () => {
  return (
    <>
      <header className="nav-container fixed">
        <Link to="/home">
          <span>HOME</span>
        </Link>
        <Link to="/createdog">
          <span>CREATE</span>
        </Link>
        <Link to="/about">
          <span>ABOUT</span>
        </Link>
        <SearchBar />
      </header>
      <div className="dumb-container"></div>
    </>
  );
};

export default NavBar;
