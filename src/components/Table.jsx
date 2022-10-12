import React, { Component, memo } from "react";
import { SORTS, largeColumn, midColumn, smallColumn } from "../constants";
import Sort from "./Sort";
import Item from "./Item";
class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sortKey: "NONE",
      isSortReverse: false,
    };
    this.onSort = this.onSort.bind(this);
  }
  onSort(sortKey) {
    const isSortReverse =
      this.state.sortKey === sortKey && !this.state.isSortReverse;
    this.setState({ sortKey, isSortReverse });
  }
  render() {
    const { list, onDismiss } = this.props;
    const { sortKey, isSortReverse } = this.state;
    const sortedList = SORTS[sortKey](list);
    const reverseSortedList = isSortReverse ? sortedList.reverse() : sortedList;
    return (
      <div className="table">
        <div className="table-header">
          <span style={largeColumn}>
            <Sort
              sortKey={"TITLE"}
              onSort={this.onSort}
              activeSortKey={sortKey}
              isSortReverse={isSortReverse}
            >
              Title
            </Sort>
          </span>
          <span style={midColumn}>
            <Sort
              sortKey={"AUTHOR"}
              onSort={this.onSort}
              activeSortKey={sortKey}
              isSortReverse={isSortReverse}
            >
              Author
            </Sort>
          </span>
          <span style={smallColumn}>
            <Sort
              sortKey={"COMMENTS"}
              onSort={this.onSort}
              activeSortKey={sortKey}
              isSortReverse={isSortReverse}
            >
              Comments
            </Sort>
          </span>
          <span style={smallColumn}>
            <Sort
              sortKey={"POINTS"}
              onSort={this.onSort}
              activeSortKey={sortKey}
              isSortReverse={isSortReverse}
            >
              Points
            </Sort>
          </span>
          <span style={smallColumn}>Archive</span>
        </div>
        {reverseSortedList.map((item) => (
          <Item item={item} onDismiss={onDismiss} key={item.objectId} />
        ))}
      </div>
    );
  }
}
// const withReverse = (Component) => (props) =>
//   props.isSortReverse ? (
//     <>
//       <i className="fas fa-angle-down"></i>
//       <Component />
//     </>
//   ) : (
//     <Component />
//   );

// const SortWithReverse = withReverse(Sort);
// console.log(SortWithReverse);
export default memo(Table);
