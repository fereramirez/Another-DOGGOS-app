import { Routes, Route } from "react-router-dom";
import "./app.css";
import Footer from "./components/Footer";
import NavBar from "./components/NavBar";
import About from "./pages/About/About";
import CreateDog from "./pages/CreateDog/CreateDog";
import DogDetails from "./pages/DogDetails/DogDetails";
import Home from "./pages/Home/Home";
import LandingPage from "./pages/LandingPage/LandingPage";
import PageNotFound from "./pages/PageNotFound/PageNotFound";

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
              <Footer />
            </>
          }
        />
        <Route
          path="/dogdetails/:id"
          element={
            <>
              <NavBar />
              <DogDetails />
              <Footer />
            </>
          }
        />
        <Route
          path="/createdog"
          element={
            <>
              <NavBar />
              <CreateDog />
              <Footer />
            </>
          }
        />
        <Route
          path="/about"
          element={
            <>
              <NavBar />
              <About />
              <Footer />
            </>
          }
        />
        <Route
          path="*"
          element={
            <>
              <NavBar />
              <PageNotFound />
              <Footer />
            </>
          }
        />
      </Routes>
    </>
  );
};

export default App;
