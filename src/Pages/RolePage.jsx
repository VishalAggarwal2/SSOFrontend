import React, { useState, useEffect } from 'react';

export function RolePage() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [roles, setRoles] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const userId = localStorage.getItem("userId");

        const response = await fetch('https://ssobackend.onrender.com/roles', {
          method: 'POST', // Change to GET if your backend expects query params instead
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ userId })
        });
        
        if (!response.ok) throw new Error('Failed to fetch roles');
        const data = await response.json();
        setRoles(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchRoles();
  }, []);

  const handleRoleClick = (role) => {
    const urlWithParams = `${role.url}?role=${encodeURIComponent(role.name)}`;
    window.location.href = urlWithParams;
  };
  
  if (!user) {
    return <p>User not found. Please login again.</p>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Welcome, {user.name}!</h2>
        <h3>Available Roles:</h3>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div style={styles.roleContainer}>
          {roles.length > 0 ? (
            roles.map((role) => (
              <button
                key={role._id}
                style={styles.roleButton}
                onClick={() => handleRoleClick(role)}
              >
                {role.name}
              </button>
            ))
          ) : (
            <p>No roles available</p>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f4f4f4',
  },
  card: {
    padding: '20px',
    width: '300px',
    borderRadius: '10px',
    backgroundColor: '#fff',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  title: {
    marginBottom: '15px',
    color: '#333',
  },
  roleContainer: {
    marginTop: '10px',
  },
  roleButton: {
    display: 'inline-block',
    margin: '5px',
    padding: '8px 16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background 0.3s',
  },
};
