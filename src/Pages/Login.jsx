import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [error,setErrorMessage]= useState("");

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:5002/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, password }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
  
      const user = data.user;
      localStorage.setItem('user', JSON.stringify(user));
  
      // Safe check before accessing roles
      if (user && user.roles && user.roles.some(role => role.name === 'admin')) {
        localStorage.setItem('admin', JSON.stringify(user));
        navigate('/admin');
      } else {
        navigate('/role');
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };
  
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>User Login</h2>
        <input
          style={styles.input}
          placeholder="Username"
          onChange={(e) => setName(e.target.value)}
        />
        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button style={styles.button} onClick={handleLogin}>
          Login
        </button>
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
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px',
  },
  button: {
    width: '100%',
    padding: '10px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#007BFF',
    color: 'white',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'background 0.3s',
  },
  roleContainer: {
    marginTop: '10px',
  },
  roleButton: {
    margin: '5px',
    padding: '8px 16px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background 0.3s',
  },
};
