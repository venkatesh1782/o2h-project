import React from 'react';
import { FaSearch } from 'react-icons/fa';

const SearchBar = ({ searchVal, onSearchChange }) => {
  return (
    <div className="input-group">
      <span className="input-group-text bg-transparent border-end-0 text-secondary">
        <FaSearch />
      </span>
      <input
        type="text"
        className="form-control border-start-0 ps-0"
        placeholder="Search tasks by title..."
        value={searchVal}
        onChange={(e) => onSearchChange(e.target.value)}
        aria-label="Search tasks"
      />
    </div>
  );
};

export default SearchBar;
