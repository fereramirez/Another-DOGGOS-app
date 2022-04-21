import { Link } from "react-router-dom";

const Card = ({ dogDetails }) => {
  return (
    <>
      <Link to={`/dogdetails/${dogDetails.id}`}>
        <h2>{dogDetails.name}</h2>
      </Link>
      <h4>{dogDetails.temperament}</h4>
      <h4>{dogDetails.weight.imperial}</h4>
      <hr />
    </>
  );
};

export default Card;
