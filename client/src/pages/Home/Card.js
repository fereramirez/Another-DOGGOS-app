import { Link } from "react-router-dom";

const Card = ({ dogDetails }) => {
  const { name, image, id } = dogDetails;
  return (
    <>
      <Link to={`/dogdetails/${id}`}>
        <img
          src={image ? image.url : "https://place.dog/300/200"}
          alt={name}
          height="120"
          weight="120"
        />
        <h4>{name}</h4>
      </Link>
    </>
  );
};

export default Card;
