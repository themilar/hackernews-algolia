import React from "react";
import classNames from "classnames";
import Button from "./Button";

const Sort = ({ sortKey, onSort, activeSortKey, children, isSortReverse }) => {
  const sortClass = classNames("button-inline", {
    "button-active": sortKey === activeSortKey,
  });
  return (
    <div>
      {isSortReverse && sortKey === activeSortKey ? (
        <i className="fas fa-angle-down"> </i>
      ) : (
        ""
      )}
      <Button onClick={() => onSort(sortKey)} className={sortClass}>
        {children}
      </Button>
    </div>
  );
};
export default Sort;
