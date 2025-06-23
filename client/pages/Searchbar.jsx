import React, { useState } from "react";

function Searchbar({ onSearch }) {
  const [searchValue, setSearchValue] = useState("");

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearch(value); // Call the onSearch prop with the current value
  };

  return (
    <input
      type="search"
      id="searchbar"
      placeholder="Search for contact..."
      value={searchValue}
      onChange={handleInputChange}
    />
  );
}

export default Searchbar;
