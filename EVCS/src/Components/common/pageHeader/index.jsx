import React from "react";

import { MdKeyboardBackspace } from "react-icons/md";
import style from "./pageHeader.module.scss";
import Button from "../Button";

const PageHeader = (props) => {
  const {
    title,
    isAddBtn,
    handleAdd,
    otherContent,
    totalRecords,
    isBackOption, 
    onBackHandle,
  } = props;

  const isTotal = totalRecords || totalRecords === 0;

  return (
    <div
      className={`${style["page-header-section"]} ${
        isTotal && style["with-count"]
      } ${isBackOption && style["with-back"]}`}
    >
      {isBackOption && (
        <div className={style["back-option"]} onClick={onBackHandle}>
          <MdKeyboardBackspace />
        </div>
      )}
      <h2>
        {title}
        {isTotal && (
          <p className={style["records-count"]}>{totalRecords} Total record</p>
        )}
      </h2>
      {(otherContent || isAddBtn) && (
        <div className="flex">
          {otherContent}
          {isAddBtn && (
            <Button className={style["add-btn"]} onClick={handleAdd}>
              Add {title}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default PageHeader;
