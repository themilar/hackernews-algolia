import React, { useRef, useEffect } from "react";

const Search = ({ value, onChange, onSubmit, children }) => {
  const searchInput = useRef();
  useEffect(() => {
    searchInput.current.focus();
  }, [searchInput]);
  return (
    <form onSubmit={onSubmit}>
      <input type="text" value={value} onChange={onChange} ref={searchInput} />
      <button type="submit">{children}</button>
    </form>
  );
};

export default Search;
