import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext'; // Adjust the path to your AuthContext file
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // To redirect after deletion

// Basic styling for the component
const styles = {
  container: {
    maxWidth: '600px',
    margin: '40px auto',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    fontFamily: 'sans-serif',
  },
  header: {
    marginBottom: '20px',
    borderBottom: '1px solid #eee',
    paddingBottom: '10px',
  },
  infoSection: {
    marginBottom: '30px',
  },
  infoItem: {
    marginBottom: '10px',
  },
  label: {
    fontWeight: 'bold',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  input: {
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '1em',
  },
  button: {
    padding: '10px 15px',
    borderRadius: '4px',
    border: 'none',
    color: '#fff',
    backgroundColor: '#007bff',
    cursor: 'pointer',
    fontSize: '1em',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    marginTop: '20px',
  },
  message: {
    padding: '10px',
    borderRadius: '4px',
    marginTop: '15px',
    textAlign: 'center',
  },
  success: {
    backgroundColor: '#d4edda',
    color: '#155724',
  },
  error: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
  },
  loading: {
    textAlign: 'center',
    fontSize: '1.2em',
  },
};

const ProfilePage = () => {
  const { user, loading, isAuthenticated, logout, checkAuthStatus } = useAuth();
  const navigate = useNavigate();

  // State for the update form
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '', // Password is empty by default for security
  });

  // State for handling messages and loading for the update/delete actions
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isUpdating, setIsUpdating] = useState(false);

  // When the user data from the context is available, populate the form
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        email: user.email,
        password: '', // Always keep password field clear initially
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handler for the profile update form submission
  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setMessage({ text: '', type: '' });

    // Filter out the password if it's empty
    const updateData = {
      username: formData.username,
      email: formData.email,
    };
    if (formData.password) {
      updateData.password = formData.password;
    }

    try {
      // Your backend exposes a PUT route to update the profile
      const response = await axios.put('/api/auth/profile', updateData, {
        withCredentials: true,
      });

      setMessage({ text: response.data.message, type: 'success' });
      // Refresh the user data in the context after a successful update
      await checkAuthStatus();
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Update failed. Please try again.';
      setMessage({ text: errorMessage, type: 'error' });
    } finally {
      setIsUpdating(false);
      // Clear the password field after submission
      setFormData((prev) => ({ ...prev, password: '' }));
    }
  };

  // Handler for the delete account button
  const handleDelete = async () => {
    // Ask for confirmation before deleting
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        // Your backend exposes a DELETE route
        const response = await axios.delete('/api/auth/profile', {
          withCredentials: true,
        });

        alert(response.data.message); // Show success message
        await logout(); // Log the user out using the context function
        navigate('/login'); // Redirect to login page
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Failed to delete account.';
        setMessage({ text: errorMessage, type: 'error' });
      }
    }
  };

  // 1. Handle initial loading state from AuthContext
  if (loading) {
    return <div style={styles.loading}>Loading Profile...</div>;
  }

  // 2. Handle case where user is not authenticated
  if (!isAuthenticated || !user) {
    return <div style={styles.container}>Please log in to view your profile.</div>;
  }

  // 3. Render the profile page for the authenticated user
  return (
    <div style={styles.container}>
      <h1 style={styles.header}>My Profile</h1>

      <div style={styles.infoSection}>
        <div style={styles.infoItem}>
          <span style={styles.label}>Username:</span> {user.username}
        </div>
        <div style={styles.infoItem}>
          <span style={styles.label}>Email:</span> {user.email}
        </div>
        <div style={styles.infoItem}>
          <span style={styles.label}>Role:</span> {user.role}
        </div>
        <div style={styles.infoItem}>
          <span style={styles.label}>Member Since:</span>{' '}
          {new Date(user.createdAt).toLocaleDateString()}
        </div>
      </div>

      <h2 style={styles.header}>Update Profile</h2>
      <form onSubmit={handleUpdate} style={styles.form}>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          style={styles.input}
          placeholder="Username"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          style={styles.input}
          placeholder="Email"
          required
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          style={styles.input}
          placeholder="New Password (optional)"
        />
        <button type="submit" style={styles.button} disabled={isUpdating}>
          {isUpdating ? 'Updating...' : 'Update Profile'}
        </button>
      </form>

      {message.text && (
        <div style={{ ...styles.message, ...(message.type === 'success' ? styles.success : styles.error) }}>
          {message.text}
        </div>
      )}

      <button onClick={handleDelete} style={{...styles.button, ...styles.deleteButton}}>
        Delete Account
      </button>
    </div>
  );
};

export default ProfilePage;