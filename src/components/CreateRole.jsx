import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addRole, updateRole } from '../features/roles/roleSlice';
import { MODULE_LIST } from '../constants/moduleList';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaSave, FaEdit, FaCheckCircle } from 'react-icons/fa';

const CreateRole = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { roleId } = useParams();

  // Get all roles from the Redux store
  const allRoles = useSelector((state) => state.roles.list);

  const isEdit = !!roleId;
  const editingRole = isEdit ? allRoles.find((r) => r.id === parseInt(roleId)) : null;

  // State for role name and selected permissions
  const [roleName, setRoleName] = useState(editingRole?.name || '');
  const [selected, setSelected] = useState(editingRole?.modules || {});
  const [errors, setErrors] = useState({});

  const MODULES_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(MODULE_LIST.length / MODULES_PER_PAGE);

  const currentModules = MODULE_LIST.slice(
    (currentPage - 1) * MODULES_PER_PAGE,
    currentPage * MODULES_PER_PAGE
  );

  /**
   * Handle checkbox logic:
   * - If "All" is selected, deselect all other permissions for that module
   * - If individual permission is selected, toggle it unless "All" is already selected
   */
  const handleCheck = (module, permission) => {
    setSelected((prev) => {
      const currentPerms = prev[module] || [];

      if (permission === 'All') {
        const isAllSelected = currentPerms.includes('All');
        return {
          ...prev,
          [module]: isAllSelected ? [] : ['All'],
        };
      } else {
        if (currentPerms.includes('All')) {
          return prev; 
        }

        const updated = currentPerms.includes(permission)
          ? currentPerms.filter((p) => p !== permission) 
          : [...currentPerms, permission]; 

        return { ...prev, [module]: updated };
      }
    });
  };

  /**
   * Validate form inputs:
   * - Role name is required, at least 3 characters, and must contain only letters
   * - At least one permission should be selected
   */
  const validateForm = () => {
    const newErrors = {};

    if (!roleName.trim()) {
      newErrors.roleName = 'Role name is required';
    } else if (roleName.trim().length < 3) {
      newErrors.roleName = 'Role name must be at least 3 characters';
    } else if (!/^[a-zA-Z]+$/.test(roleName.trim())) {
      newErrors.roleName = 'Role name can only contain letters';
    }

    const hasAtLeastOnePermission = Object.values(selected).some((perms) => perms.length > 0);
    if (!hasAtLeastOnePermission) {
      newErrors.permissions = 'Select at least one permission';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Handle form submission:
   * - Validate inputs
   * - Dispatch add or update role action
   * - Navigate back to roles list after toast
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const rolePayload = {
      id: isEdit ? editingRole.id : Date.now(),
      name: roleName.trim(),
      modules: selected,
      status: 'Active',
    };

    if (isEdit) {
      dispatch(updateRole(rolePayload));
      toast.success('Role updated successfully!');
    } else {
      dispatch(addRole(rolePayload));
      toast.success('Role created successfully!');
    }

    // Navigate back after success message
    setTimeout(() => navigate('/roles'), 1000);
  };

  return (
    <div className="container mt-4">
      {/* Toast notifications container */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      {/* Card container */}
      <div className="card shadow-sm mx-auto" style={{ maxWidth: '700px' }}>
        <div className="card-body">
          <h4 className="card-title text-center mb-4">
            {isEdit ? <><FaEdit className="me-2" />Edit Role</> : <><FaSave className="me-2" />Create Role</>}
          </h4>

          {/* Role form */}
          <form onSubmit={handleSubmit} noValidate>
            <div className="mb-3">
              <label className="form-label">Role Name</label>
              <input
                type="text"
                className={`form-control ${errors.roleName ? 'is-invalid' : ''}`}
                value={roleName}
                onChange={(e) => setRoleName(e.target.value)}
                placeholder="Enter role name"
              />
              {errors.roleName && <div className="invalid-feedback">{errors.roleName}</div>}
            </div>

            <div className="mb-3">
              <h5 className="mb-3">Assign Permissions</h5>
              {errors.permissions && (
                <div className="text-danger mb-2">
                  <small>{errors.permissions}</small>
                </div>
              )}

              {/* Permissions Table */}
              <div className="table-responsive">
                <table className="table table-bordered align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Module</th>
                      <th>Permissions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentModules.map(({ name, permissions }) => {
                      const perms = permissions.includes('All') ? permissions : ['All', ...permissions];
                      const isAllSelected = selected[name]?.includes('All');
                      return (
                        <tr key={name}>
                          <td className="fw-semibold">{name}</td>
                          <td>
                            <div className="d-flex flex-wrap gap-3">
                              {perms.map((perm) => (
                                <div key={perm} className="form-check me-3">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={selected[name]?.includes(perm) || false}
                                    disabled={isAllSelected && perm !== 'All'}
                                    onChange={() => handleCheck(name, perm)}
                                    id={`${name}-${perm}`}
                                  />
                                  <label className="form-check-label" htmlFor={`${name}-${perm}`}>
                                    {perm}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination controls */}
              {totalPages > 1 && (
                <nav className="mt-3">
                  <ul className="pagination justify-content-center">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button className="page-link" onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}>
                        Previous
                      </button>
                    </li>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                        <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                          {i + 1}
                        </button>
                      </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button className="page-link" onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}>
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              )}
            </div>

            <div className="text-end">
              <button className="btn btn-primary" type="submit">
                <FaCheckCircle className="me-2" />
                {isEdit ? 'Update Role' : 'Save Role'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateRole;
