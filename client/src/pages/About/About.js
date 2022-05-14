import "./About.css";
import react from "../../Assets/react.svg";
import redux from "../../Assets/redux.svg";
import express from "../../Assets/express.svg";
import postgresql from "../../Assets/postgresql.svg";
import sequelize from "../../Assets/sequelize.svg";

const About = () => {
  return (
    <div className="about-page">
      <p>
        This is my first React project. It's a CRUD app and was based on final
        projects of some Frontend Bootcamps. It was done using the following
        technologies{" "}
      </p>
      <div>
        <a href="https://reactjs.org/" rel="noreferrer" target="_blank">
          <img src={react} alt="React" />
          <span>React</span>
        </a>
        <a href="https://redux.js.org/" rel="noreferrer" target="_blank">
          <img src={redux} alt="Redux" />
          <span>Redux</span>
        </a>
        <a href="https://expressjs.com/" rel="noreferrer" target="_blank">
          <img src={express} alt="Express" />
          <span>Express</span>
        </a>
        <a href="https://www.postgresql.org/" rel="noreferrer" target="_blank">
          <img src={postgresql} alt="PostgreSQL" className="postresql" />
          <span>PostgreSQL</span>
        </a>
        <a href="https://sequelize.org/" rel="noreferrer" target="_blank">
          <img src={sequelize} alt="Sequelize" />
          <span>Sequelize</span>
        </a>
      </div>
    </div>
  );
};

export default About;
