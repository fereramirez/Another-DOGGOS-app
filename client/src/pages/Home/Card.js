import { Link } from "react-router-dom";
import "./Card.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons";

const Card = ({ dogDetails }) => {
  const { name, image, id } = dogDetails;
  return (
    <div className="card">
      <Link to={`/dogdetails/${id}`}>
        <span className="data-card">
          <div className="link-text">{name}</div>
          <img
            src={image ? image.url : "https://place.dog/300/200"}
            alt={name}
          />
          <p>
            View details
            <FontAwesomeIcon icon={faArrowRightLong} />
          </p>
        </span>
      </Link>
    </div>
  );
};

export default Card;
