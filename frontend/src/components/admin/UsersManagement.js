import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AdminAuthContext } from "../../context/AdminAuthContext";
function UsersManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { getAuthHeader } = useContext(AdminAuthContext);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/admin/users", {
        headers: getAuthHeader()
      });
      setUsers(res.data);
    } catch (err) {
      setError("Failed to fetch users");
      console.error("Users fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    
    try {
      await axios.delete(`http://localhost:4000/api/admin/users/${userId}`, {
        headers: getAuthHeader()
      });
      setUsers(users.filter(user => user._id !== userId));
      alert("User deleted successfully");
    } catch (err) {
      alert("Failed to delete user");
      console.error("Delete user error:", err);
    }
  };

  if (loading) return <div className="loading">Loading users...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="users-management">
      <h1>Users Management</h1>
      <div className="table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Joined Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <button 
                    onClick={() => handleDeleteUser(user._id)}
                    className="btn-danger"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UsersManagement;