import { Link } from "react-router-dom";

const Card = ({ dogDetails }) => {
  return (
    <>
      <Link to={`/dogdetails/${dogDetails.id}`}>
        <h4>{dogDetails.name}</h4>
      </Link>
      <h5>{dogDetails.temperament}</h5>
      <h5>{dogDetails.weight.imperial}</h5>
      <hr />
    </>
  );
};

export default Card;
