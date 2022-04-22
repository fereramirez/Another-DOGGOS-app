import { Link } from "react-router-dom";

const Card = ({ dogDetails }) => {
  return (
    <>
      <Link to={`/dogdetails/${dogDetails.id}`}>
        <h3>{dogDetails.name}</h3>
      </Link>
      <h4>{dogDetails.temperament}</h4>
      <hr />
    </>
  );
};

export default Card;
