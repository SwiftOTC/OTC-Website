import React from "react";
import PropTypes from "prop-types";
import Close from "./close.svg";
import './_modal.scss'

const Modal = ({
  modalId,
  visible,
  children,
  setIsVisible,
  onModalClose,
  maxWidth,top
}) => {
  let className = "modal fade ";
  let style = {};
  if (visible) {
    className += " show";
    style = { display: "block",background: 'rgba(0, 0, 0, 0.5)' };
  }

  return (
    <div
      className={className}
      id={modalId}
      style={style}
      tabIndex="-1"
      aria-labelledby={`modalLabel` + modalId}
      aria-hidden="true"
    >
      <div className="modal-dialog" style={{ maxWidth: maxWidth, top: top }}>
        <div className="modal-content p-0 position-relative">
          {/* <img src={require("../../../Assets/General/times-icon.svg").default} alt="" aria-hidden="true" className="close" data-dismiss="modal" aria-label="Close" /> */}
          <span
            onClick={onModalClose}
            aria-hidden="true"
            data-dismiss="modal"
            aria-label="Close"
            className="close-btn walletclose d-flex justify-content-end p-2"
          >
            <img src={Close} alt="" className="close-icon" />
          </span>
          {children}
        </div>
      </div>
    </div>
  );
};
Modal.defaultProps = {
  setIsVisible: () => {},
};
Modal.propTypes = {
  modalId: PropTypes.string,
  children: PropTypes.element,
  visible: PropTypes.bool,
  onModalClose: PropTypes.func,
};

export default Modal;
