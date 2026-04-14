import React from "react";
import "./loader.scss";
import { Spinner } from "react-activity";
function Loader({ active }) {
  return (
    <>
      {active === true && (
        <div className="loader">
          <Spinner />
        </div>
      )}
    </>
  );
}

export default Loader;
