import React, { useState } from 'react';

/**
 * UserManagement - User management page with table and add/edit forms
 * Shows only non-sensitive information (ID, username)
 * Includes form validation and CRUD operations
 */
function UserManagement({ users, onAddUser, onUpdateUser, onDeleteUser }) {
  // Track if modal is open and what mode it's in (add or edit)
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  
  // Track form validation errors
  const [errors, setErrors] = useState({});
  
  // Form data for new/edit user
  const [formData, setFormData] = useState({
    username: ''
  });

  // Open modal for adding new user
  const handleAddClick = () => {
    setEditingUser(null);
    setFormData({ username: '' });
    setErrors({});
    setModalOpen(true);
  };

  // Open modal for editing user
  const handleEditClick = (user) => {
    setEditingUser(user);
    setFormData({
      username: user.username
    });
    setErrors({});
    setModalOpen(true);
  };

  // Close modal
  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingUser(null);
    setFormData({ username: '' });
    setErrors({});
  };

  // Validate form data
  const validateForm = () => {
    const newErrors = {};

    // Validate username
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.trim().length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    }

    // Check if username is already in use (only for new users)
    if (!editingUser) {
      const usernameExists = users.some(u => u.username === formData.username);
      if (usernameExists) {
        newErrors.username = 'This username is already taken';
      }
    }

    return newErrors;
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Submit form (add or edit user)
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (editingUser) {
      // Update existing user
      onUpdateUser({
        ...editingUser,
        ...formData
      });
    } else {
      // Add new user
      onAddUser(formData);
    }

    handleCloseModal();
  };

  // Handle delete with confirmation
  const handleDelete = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      onDeleteUser(userId);
    }
  };

  return (
    <div className="page-section">
      <div className="section-header">
        <div>
          <h1>User Management</h1>
          <p className="section-subtitle">Manage registered users</p>
        </div>
        <button className="btn-primary" onClick={handleAddClick}>
          + Add User
        </button>
      </div>

      {/* Users Table */}
      <div className="table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Username</th>
              <th>Status</th>
              <th>Join Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="5" className="empty-message">
                  No users found. Add a new user to get started.
                </td>
              </tr>
            ) : (
              users.map(user => (
                <tr key={user.id}>
                  <td><strong>#{user.id}</strong></td>
                  <td>{user.username}</td>
                  <td><span className="status-badge active">{user.status}</span></td>
                  <td>{user.joinDate}</td>
                  <td>
                    <div className="action-buttons">
                      <button 
                        className="btn-edit"
                        onClick={() => handleEditClick(user)}
                        title="Edit"
                      >
                        ✎
                      </button>
                      <button 
                        className="btn-delete"
                        onClick={() => handleDelete(user.id)}
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal for Add/Edit User */}
      {modalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingUser ? 'Edit User' : 'Add New User'}</h2>
              <button className="modal-close" onClick={handleCloseModal}>✕</button>
            </div>

            <form className="user-form" onSubmit={handleSubmit}>
              {/* Username Field */}
              <div className="form-group">
                <label htmlFor="username">Username *</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={`form-input ${errors.username ? 'error' : ''}`}
                  placeholder="Enter username (letters, numbers, underscore only)"
                />
                {errors.username && <span className="error-message">{errors.username}</span>}
              </div>

              {/* Form Buttons */}
              <div className="form-buttons">
                <button type="button" className="btn-secondary" onClick={handleCloseModal}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingUser ? 'Update User' : 'Add User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default UserManagement;
