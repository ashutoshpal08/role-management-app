import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { deleteRole } from '../features/roles/roleSlice'
import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa'

const RoleList = () => {

  const roles = useSelector(state => state.roles.list)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [currentPage, setCurrentPage] = useState(1)

  const rolesPerPage = 5
  const indexOfLastRole = currentPage * rolesPerPage
  const indexOfFirstRole = indexOfLastRole - rolesPerPage

  const currentRoles = roles.slice(indexOfFirstRole, indexOfLastRole)

  // Total number of pages needed for pagination
  const totalPages = Math.ceil(roles.length / rolesPerPage)

  const handleDelete = (id) => {
    dispatch(deleteRole(id))
    toast.success('Role deleted successfully!')
  }

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber)
    }
  }

  return (
    <div>
      {/* Toast message container for success/error notifications */}
      <ToastContainer />

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Role List</h3>
        <button className="btn btn-primary" onClick={() => navigate('/create-role')}>
          <FaPlus className="me-2" /> Create New Role
        </button>
      </div>

      {roles.length === 0 ? (
        <div className="alert alert-warning text-center">No roles available.</div>
      ) : (
        <>
          {/* Table showing paginated roles */}
          <table className="table table-bordered">
            <thead className="table-light">
              <tr>
                <th>No.</th>
                <th>Name</th>
                <th>Modules & Permissions</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentRoles.map((role, index) => (
                <tr key={role.id}>
                  <td>{indexOfFirstRole + index + 1}</td>
                  <td>{role.name}</td>

                  <td>
                    {Object.entries(role.modules).map(([module, permissions]) => (
                      <div key={module}>
                        <strong>{module}</strong>: {permissions.join(', ')}
                      </div>
                    ))}
                  </td>

                  <td>
                    <span className="badge bg-success">{role.status}</span>
                  </td>

                  {/* Edit and Delete buttons */}
                  <td>
                    <div className="d-flex gap-2">
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => navigate(`/edit-role/${role.id}`)}
                      >
                        <FaEdit className="me-1" /> Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDelete(role.id)}
                      >
                        <FaTrash className="me-1" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination (only shown if total pages > 1) */}
          {totalPages > 1 && (
            <nav>
              <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage - 1)}
                  >
                    Previous
                  </button>
                </li>

                {/* Page number buttons */}
                {[...Array(totalPages).keys()].map((number) => (
                  <li
                    key={number + 1}
                    className={`page-item ${currentPage === number + 1 ? 'active' : ''}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(number + 1)}
                    >
                      {number + 1}
                    </button>
                  </li>
                ))}

                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button
                    className="page-link"
                    onClick={() => handlePageChange(currentPage + 1)}
                  >
                    Next
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </>
      )}
    </div>
  )
}

export default RoleList
