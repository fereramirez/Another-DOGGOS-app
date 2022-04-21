import { Routes, Route } from "react-router-dom";
import "./app.css";
import CreateDog from "./pages/CreateDog/CreateDog";
import DogDetails from "./pages/DogDetails/DogDetails";
import Home from "./pages/Home/Home";
import LandingPage from "./pages/LandingPage/LandingPage";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/home" element={<Home />} />
      <Route path="/dogdetails/:id" element={<DogDetails />} />
      <Route path="/createdog" element={<CreateDog />} />
    </Routes>
  );
};

export default App;
