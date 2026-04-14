import React from "react";
import { Dots } from "react-activity";
import "./button.scss";

function Button(props) {
  const { loading, children, className } = props;
  return (
    <button {...props} className={`button ${className}`} disabled={loading}>
      {loading ? <Dots /> : children}
    </button>
  );
}

export default Button;
