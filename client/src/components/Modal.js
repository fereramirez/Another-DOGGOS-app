import "./Modal.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBone,
  faCircleXmark,
  faTriangleExclamation,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

const Modal = ({ children, isOpen, closeModal, type }) => {
  const handleModalContainerClick = (e) => e.stopPropagation();

  return (
    <article className={`modal ${isOpen && "is-open"}`} onClick={closeModal}>
      <div
        className={`modal-container ${type}`}
        onClick={handleModalContainerClick}
      >
        {/* <button className="modal-close" onClick={closeModal}>
          X
        </button> */}
        <span className="type-svg">
          {type === "success" ? (
            <FontAwesomeIcon icon={faBone} />
          ) : type === "warn" ? (
            <FontAwesomeIcon icon={faTriangleExclamation} />
          ) : (
            <FontAwesomeIcon icon={faCircleXmark} />
          )}
        </span>
        <div onClick={closeModal} className="modal-close x-mark">
          <FontAwesomeIcon icon={faXmark} />
        </div>
        {children}
      </div>
    </article>
  );
};

export default Modal;
