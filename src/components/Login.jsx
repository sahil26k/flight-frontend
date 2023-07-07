import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './login.css'
const LoginPage = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
   
    // Create a request body with the username and password
    const requestBody = {
      username,
      password
    };

    // Send a POST request to the backend for authentication
    axios.post('https://flightapi-xdy0.onrender.com/authen', requestBody)
      .then((response) => {
        const { success, message } = response.data;

        if (success) {
          if(username==='admin' && password === 'admin'){
            navigate('/adminhome');
          } else {
          // Successful login
          navigate('/userhome', { state: { username } });}
        } else {
          // Invalid credentials
          setErrorMessage(message);
        }

        // Reset form fields
        setUsername('');
        setPassword('');
      })
      .catch((error) => {
        console.error(error);
      });
  }; 

  return (
    <div className='login-container'>
      <h2>Login Page</h2>
      {errorMessage && <p>{errorMessage}</p>}
      <form onSubmit={handleLogin}>
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <label htmlFor="password">Password:</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Login</button>
      </form>

      <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
    </div>
  );
};

export default LoginPage;
