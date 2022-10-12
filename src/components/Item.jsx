import { memo } from "react";
import { largeColumn, midColumn, smallColumn } from "../constants";
import Button from "./Button";
export default memo(function Item({ item, onDismiss }) {
  return (
    <div className="table-row">
      <span style={largeColumn}>
        <a href={item.url}>{item.title}</a>
      </span>
      <span style={midColumn}>{item.author}</span>
      <span style={smallColumn}>{item.num_comments}</span>
      <span style={smallColumn}>{item.points}</span>
      <span style={smallColumn}>
        <Button
          onClick={() => onDismiss(item.objectID)}
          className="button-inline"
        >
          Dismiss
        </Button>
      </span>
    </div>
  );
});
