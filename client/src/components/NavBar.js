import { Link } from "react-router-dom";

const NavBar = () => {
  return (
    <>
      <Link to="/home">HOME</Link>
      <Link to="/createdog">CREATE</Link>
      <Link to="/about">ABOUT</Link>
    </>
  );
};

export default NavBar;
