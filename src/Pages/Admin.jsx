import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminPage.css'; // Import the CSS file

export default function AdminPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [roleName, setRoleName] = useState('');
  const [roleUrl, setRoleUrl] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [selectedRoleId, setSelectedRoleId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const isAdmin = user?.roles?.some((role) => role.name === 'admin');

    if (!user || !isAdmin) {
      navigate('/login');
    } else {
      fetchUsers();
      fetchRoles();
    }
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('https://ssobackend.onrender.com/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await fetch('https://ssobackend.onrender.com/roles');
      if (!response.ok) throw new Error('Failed to fetch roles');
      const data = await response.json();
      setRoles(data);
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const createUser = async () => {
    try {
      await fetch('https://ssobackend.onrender.com/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newUserName, password: newUserPassword }),
      });
      fetchUsers();
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const createRole = async () => {
    try {
      await fetch('https://ssobackend.onrender.com/roles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: roleName, url: roleUrl }),
      });
      fetchRoles();
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const addRoleToUser = async (userId) => {
    try {
      await fetch(`https://ssobackend.onrender.com/users/${userId}/roles`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roleId: selectedRoleId }),
      });
      fetchUsers();
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const removeRoleFromUser = async (userId, roleId) => {
    try {
      await fetch(`https://ssobackend.onrender.com/users/${userId}/roles`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roleId }),
      });
      fetchUsers();
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('admin');
    navigate('/login');
  };

  return (
    <div className="admin-container">
      <h2 className="admin-heading">Admin Panel</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <button className="logout-button" onClick={logout}>
        Logout
      </button>

      <div className="form-section">
        <h3>Create User</h3>
        <input
          className="input-field"
          placeholder="Username"
          value={newUserName}
          onChange={(e) => setNewUserName(e.target.value)}
        />
        <input
          className="input-field"
          placeholder="Password"
          type="password"
          value={newUserPassword}
          onChange={(e) => setNewUserPassword(e.target.value)}
        />
        <button className="action-button" onClick={createUser}>
          Create User
        </button>
      </div>

      <div className="form-section">
        <h3>Create Role</h3>
        <input
          className="input-field"
          placeholder="Role Name"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
        />
        <input
          className="input-field"
          placeholder="Role URL"
          value={roleUrl}
          onChange={(e) => setRoleUrl(e.target.value)}
        />
        <button className="action-button" onClick={createRole}>
          Create Role
        </button>
      </div>

      <h3>Users</h3>
      <div className="users-list">
        {users.map((user) => (
          <div key={user._id} className="user-item">
            <p className="user-name">{user.name}</p>
            <p>Roles:</p>
            <ul>
              {user.roles.length > 0 ? (
                user.roles.map((role) => (
                  <li key={role._id} className="role-item">
                    {role.name} - {role.url}
                    <button
                      className="remove-role-button"
                      onClick={() => removeRoleFromUser(user._id, role._id)}
                    >
                      Remove Role
                    </button>
                  </li>
                ))
              ) : (
                <li>No roles assigned</li>
              )}
            </ul>
            <select
              className="select-role"
              value={selectedRoleId}
              onChange={(e) => setSelectedRoleId(e.target.value)}
            >
              <option value="">Select Role</option>
              {roles.map((role) => (
                <option key={role._id} value={role._id}>
                  {role.name}
                </option>
              ))}
            </select>
            <button
              className="action-button"
              onClick={() => addRoleToUser(user._id)}
              disabled={!selectedRoleId}
            >
              Add Role to User
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
