import React from 'react'

const ContactFilter = ({ filterUser, activeFilter }) => {
  return (
    <select 
      name="select-filter" 
      className="form-select" 
      onChange={(e) => filterUser(e.target.value)}
      value={activeFilter}
      aria-label="Filter contacts"
    >
      <option value="">--select filter--</option>
      <option value="favorite">Favorites</option>
      <option value="blocked">Blocked</option>
    </select>
  )
}

export default ContactFilter