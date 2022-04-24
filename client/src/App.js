import { Routes, Route } from "react-router-dom";
import "./app.css";
import NavBar from "./components/NavBar";
import About from "./pages/About/About";
import CreateDog from "./pages/CreateDog/CreateDog";
import DogDetails from "./pages/DogDetails/DogDetails";
import Home from "./pages/Home/Home";
import LandingPage from "./pages/LandingPage/LandingPage";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/home"
          element={
            <>
              <NavBar />
              <Home />
            </>
          }
        />
        <Route
          path="/dogdetails/:id"
          element={
            <>
              <NavBar />
              <DogDetails />
            </>
          }
        />
        <Route
          path="/createdog"
          element={
            <>
              <NavBar />
              <CreateDog />
            </>
          }
        />
        <Route
          path="/about"
          element={
            <>
              <NavBar />
              <About />
            </>
          }
        />
      </Routes>
    </>
  );
};

export default App;
