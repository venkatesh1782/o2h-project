import React from 'react';

const FilterDropdown = ({ statusVal, onStatusChange }) => {
  const statuses = ['All', 'Pending', 'In Progress', 'Completed'];

  return (
    <div className="d-flex align-items-center gap-2">
      <label htmlFor="status-filter" className="text-secondary small fw-medium text-nowrap mb-0 d-none d-sm-inline-block">
        Filter Status:
      </label>
      <select
        id="status-filter"
        className="form-select form-select-sm"
        value={statusVal}
        onChange={(e) => onStatusChange(e.target.value)}
        style={{ minWidth: '130px' }}
      >
        {statuses.map((status) => (
          <option key={status} value={status}>
            {status}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterDropdown;
