import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AdminAuthContext } from "../../context/AdminAuthContext";
import Swal from 'sweetalert2';

function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [limit] = useState(20);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", avatarUrl: "" });
  const [actionLoading, setActionLoading] = useState(null); // Track individual action loading states
  const { getAuthHeader } = useContext(AdminAuthContext);

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm, statusFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: limit.toString(),
        ...(searchTerm && { q: searchTerm }),
        ...(statusFilter !== "all" && { status: statusFilter })
      });

      const res = await axios.get(`http://localhost:4000/api/admin/users?${params}`, {
        headers: getAuthHeader()
      });

      setUsers(res.data.users);
      setTotalUsers(res.data.total);
      setError(null); // Clear any previous errors
    } catch (err) {
      setError("Failed to fetch users");
      console.error("Users fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSuspendUser = async (userId) => {
    const result = await Swal.fire({
      title: 'Are you sure you want to suspend this user?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3C83F6',
      cancelButtonColor: '#aaa',
      confirmButtonText: 'Yes, suspend'
    });
    if (result.isDismissed) return;

    setActionLoading(userId); // Set loading for this specific user

    try {
      const res = await axios.post(`http://localhost:4000/api/admin/users/${userId}/suspend`,
        { reason: "Suspended by admin" },
        { headers: getAuthHeader() }
      );

      // ✅ Use functional update to ensure we have the latest state
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user._id === userId ? { ...user, isSuspended: true } : user
        )
      );

      // ✅ Optional: Refetch users to ensure data consistency
      await fetchUsers();

      Swal.fire({
        icon: 'success',
        title: 'User suspended successfully',
        confirmButtonColor: '#3C83F6'
      });
    } catch (err) {
      console.error("Suspend user error:", err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.error || 'Failed to suspend user',
        confirmButtonColor: '#3C83F6'
      });
    } finally {
      setActionLoading(null); // Clear loading state
    }
  };

  const handleUnsuspendUser = async (userId) => {
    setActionLoading(userId);

    try {
      const res = await axios.post(`http://localhost:4000/api/admin/users/${userId}/unsuspend`,
        {},
        { headers: getAuthHeader() }
      );

      // ✅ Use functional update
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user._id === userId ? { ...user, isSuspended: false } : user
        )
      );

      Swal.fire({
        icon: 'success',
        title: 'User unsuspended successfully',
        confirmButtonColor: '#3C83F6'
      });
    } catch (err) {
      console.error("Unsuspend user error:", err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.error || 'Failed to unsuspend user',
        confirmButtonColor: '#3C83F6'
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleResetPassword = async (userId) => {
    const result2 = await Swal.fire({
      title: "Reset this user's password?",
      text: 'A new password will be generated.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3C83F6',
      cancelButtonColor: '#aaa',
      confirmButtonText: 'Yes, reset'
    });
    if (result2.isDismissed) return;

    setActionLoading(userId);

    try {
      const res = await axios.post(`http://localhost:4000/api/admin/users/${userId}/reset-password`,
        {},
        { headers: getAuthHeader() }
      );

      Swal.fire({
        icon: 'success',
        title: 'Password Reset',
        text: `Password reset successfully! New password: ${res.data.newPassword}`,
        confirmButtonColor: '#3C83F6'
      });
    } catch (err) {
      console.error("Reset password error:", err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.error || 'Failed to reset password',
        confirmButtonColor: '#3C83F6'
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setEditForm({
      name: user.name || "",
      avatarUrl: user.avatarUrl || ""
    });
    setShowEditModal(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setActionLoading(selectedUser._id);

    try {
      const res = await axios.put(`http://localhost:4000/api/admin/users/${selectedUser._id}`,
        editForm,
        { headers: getAuthHeader() }
      );

      // ✅ Update local state with functional update
      setUsers(prevUsers =>
        prevUsers.map(user =>
          user._id === selectedUser._id ? { ...user, ...res.data } : user
        )
      );

      setShowEditModal(false);
      Swal.fire({
        icon: 'success',
        title: 'User updated successfully',
        confirmButtonColor: '#3C83F6'
      });
    } catch (err) {
      console.error("Update user error:", err);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.error || 'Failed to update user',
        confirmButtonColor: '#3C83F6'
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalUsers / limit);

  if (loading && users.length === 0) return <div className="loading">Loading users...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="users-management">
      <div className="users-header">
        <h1>Users Management</h1>
        <div className="users-stats">
          Total Users: {totalUsers}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="users-filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>
        <div className="filter-box">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="filter-select"
          >
            <option value="all">All Users</option>
            <option value="active">Active Only</option>
            <option value="suspended">Suspended Only</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Status</th>
              <th>Joined Date</th>
              <th>Last Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="6" className="no-data">No users found</td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user._id} className={user.isSuspended ? "suspended" : ""}>
                  <td>
                    <div className="user-info">
                      {user.avatarUrl && (
                        <img src={user.avatarUrl} alt={user.name} className="user-avatar" />
                      )}
                      <span>{user.name || "No Name"}</span>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`status-badge ${user.isSuspended ? "suspended" : "active"}`}>
                      {user.isSuspended ? "Suspended" : "Active"}
                    </span>
                  </td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>
                    {user.lastActive
                      ? new Date(user.lastActive).toLocaleDateString()
                      : "Never"
                    }
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="btn-edit"
                        title="Edit User"
                        disabled={actionLoading === user._id}
                      >
                        {actionLoading === user._id ? "⏳" : "✏️"}
                      </button>

                      {user.isSuspended ? (
                        <button
                          onClick={() => handleUnsuspendUser(user._id)}
                          className="btn-success"
                          title="Unsuspend User"
                          disabled={actionLoading === user._id}
                        >
                          {actionLoading === user._id ? "⏳" : "✅"}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleSuspendUser(user._id)}
                          className="btn-warning"
                          title="Suspend User"
                          disabled={actionLoading === user._id}
                        >
                          {actionLoading === user._id ? "⏳" : "⏸️"}
                        </button>
                      )}

                      <button
                        onClick={() => handleResetPassword(user._id)}
                        className="btn-secondary"
                        title="Reset Password"
                        disabled={actionLoading === user._id}
                      >
                        {actionLoading === user._id ? "⏳" : "🔑"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            Previous
          </button>

          <span className="pagination-info">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            Next
          </button>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Edit User</h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="modal-close"
                disabled={actionLoading === selectedUser?._id}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleUpdateUser} className="modal-form">
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  required
                  disabled={actionLoading === selectedUser?._id}
                />
              </div>
              <div className="form-group">
                <label>Avatar URL:</label>
                <input
                  type="url"
                  value={editForm.avatarUrl}
                  onChange={(e) => setEditForm({ ...editForm, avatarUrl: e.target.value })}
                  placeholder="https://example.com/avatar.jpg"
                  disabled={actionLoading === selectedUser?._id}
                />
              </div>
              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  disabled={actionLoading === selectedUser?._id}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={actionLoading === selectedUser?._id}
                >
                  {actionLoading === selectedUser?._id ? "Updating..." : "Update User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default UsersManagement;