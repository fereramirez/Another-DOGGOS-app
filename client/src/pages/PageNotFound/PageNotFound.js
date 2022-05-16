import video from "../../Assets/dogs-shiba.mp4";
import "./PageNotFound.css";

const PageNotFound = () => {
  return (
    <>
      <div className="page-not-found">
        <h1>It's not a paradox, this page doesn't exist.</h1>
        <h1>Here some good boys.</h1>
      </div>
      <video className="not-exists-video" autoPlay loop muted>
        <source src={video} type="video/mp4" />
      </video>
    </>
  );
};

export default PageNotFound;
