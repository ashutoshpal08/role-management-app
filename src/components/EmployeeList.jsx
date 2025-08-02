import { useState, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { assignRole, removeRole } from '../features/employees/employeeSlice';
import { useNavigate } from 'react-router-dom';
import { FaPlus, FaSearch } from 'react-icons/fa';

const EmployeeList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state for employees and roles
  const employees = useSelector(state => state.employees.list);
  const roles = useSelector(state => state.roles.list);

  // UI state
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [selectedRoles, setSelectedRoles] = useState({}); 

  const itemsPerPage = 5;

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp =>
      emp.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [employees, debouncedSearchTerm]);

  const sortedEmployees = useMemo(() => {

    if (!sortField) return filteredEmployees;
    return [...filteredEmployees].sort((a, b) => {
      if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
      if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
    
  }, [filteredEmployees, sortField, sortDirection]);

  // Paginate sorted employees
  const paginatedEmployees = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedEmployees.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedEmployees, currentPage]);

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);

  const handleAssign = (employeeId, roleId) => {
    const role = roles.find(r => r.id === parseInt(roleId));
    if (role) {
      dispatch(assignRole({ employeeId, roleId: role.id }));
      setSelectedRoles(prev => ({ ...prev, [employeeId]: '' }));
    }
  };

  const handleRemove = (employeeId, roleId) => {
    dispatch(removeRole({ employeeId, roleId }));
  };

  // Handle sorting logic
  const handleSort = field => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const renderSortArrow = field => {
    const active = sortField === field;
    const arrow = sortDirection === 'asc' ? '▲' : '▼';
    return <span style={{ opacity: active ? 1 : 0.3, marginLeft: '4px' }}>{arrow}</span>;
  };

  return (
    <div className="container p-3 shadow-sm bg-white rounded">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="mb-0">Employee List</h3>
        <button className="btn btn-primary" onClick={() => navigate('/create-role')}>
          <FaPlus className="me-2" /> Create New Role
        </button>
      </div>

      {/* Search Box */}
      <div className="mb-4 w-50">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Search employee by name..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <span className="input-group-text">
            <FaSearch />
          </span>
        </div>
      </div>

      {/* Employee Table */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-light">
            <tr>
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort('id')}>
                No. {renderSortArrow('id')}
              </th>
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort('name')}>
                Name {renderSortArrow('name')}
              </th>
              <th>Roles</th>
              <th>Assign New Role</th>
            </tr>
          </thead>
          <tbody>
            {paginatedEmployees.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center text-muted py-4">
                  No matching employees found.
                </td>
              </tr>
            ) : (
              paginatedEmployees.map(emp => (
                <tr key={emp.id}>
                  <td>{emp.id}</td>
                  <td>{emp.name}</td>
                  <td>
                    {emp.roles.length === 0 ? (
                      <span className="text-muted">No role assigned</span>
                    ) : (
                      <div className="d-flex flex-wrap gap-2">
                        {emp.roles.map(roleId => {
                          const role = roles.find(r => r.id === roleId);
                          return role ? (
                            <span
                              key={roleId}
                              className="badge bg-info text-dark d-flex align-items-center"
                            >
                              {role.name}
                              <button
                                className="btn btn-sm btn-outline-danger btn-close ms-2 p-1"
                                aria-label="Remove"
                                onClick={() => handleRemove(emp.id, roleId)}
                              />
                            </span>
                          ) : null;
                        })}
                      </div>
                    )}
                  </td>

                  {/* Dropdown for assigning role */}
                  <td>
                    <select
                      className="form-select w-100"
                      value={selectedRoles[emp.id] || ''}
                      onChange={e => {
                        const selected = e.target.value;
                        setSelectedRoles(prev => ({ ...prev, [emp.id]: selected }));
                        handleAssign(emp.id, selected);
                      }}
                    >
                      <option value="" disabled>
                        Select Role
                      </option>
                      {roles
                        .filter(role => !emp.roles.includes(role.id))
                        .map(role => (
                          <option key={role.id} value={role.id}>
                            {role.name}
                          </option>
                        ))}
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="mt-4">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              >
                &laquo; Previous
              </button>
            </li>

            {Array.from({ length: totalPages }, (_, index) => {
              const page = index + 1;
              return (
                <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                  <button className="page-link" onClick={() => setCurrentPage(page)}>
                    {page}
                  </button>
                </li>
              );
            })}

            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              >
                Next &raquo;
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default EmployeeList;
