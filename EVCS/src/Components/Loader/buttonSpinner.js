import React from "react";
import "./loader.scss";

const SmallSpinner = (props) => {
  return (
    <svg
      viewBox="25 25 50 50"
      className={`circular button-spinner ${props.className || ""}`}
    >
      <circle
        className="path"
        cx="50"
        cy="50"
        r="20"
        fill="none"
        strokeWidth="2"
        strokeMiterlimit="10"
      />
    </svg>
  );
};

export default SmallSpinner;
