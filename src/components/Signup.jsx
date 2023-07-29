import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './signup.css';

const Signup = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Step 1: State for loader

  const handleSubmit = (e) => {
    e.preventDefault();

    setIsLoading(true); // Step 2: Show loader when signup process starts

    // Create a new user object
    const newUser = {
      username,
      password,
      email,
      contact_number: contactNumber
    };

    // Create a new auth object
    const newAuth = {
      username,
      password
    };

    // Send a POST request to create a new user in the users table
    axios
      .post('https://flightapi-xdy0.onrender.com/users', newUser)
      .then((response) => {
        console.log(response.data);
        // Reset the form fields
        setUsername('');
        setPassword('');
        setEmail('');
        setContactNumber('');

        // Send a POST request to create a new auth entry in the auth table
        axios
          .post('https://flightapi-xdy0.onrender.com/authenticate', newAuth)
          .then((response) => {
            console.log(response.data);
            setIsLoading(false); // Step 2: Hide loader when signup process is complete
            // Navigate to the home page after successful signup
            navigate('/userhome', { state: { username } });
          })
          .catch((error) => {
            setIsLoading(false); // Step 2: Hide loader when signup process encounters an error
            console.error(error.response.data);
          });
      })
      .catch((error) => {
        setIsLoading(false); // Step 2: Hide loader when signup process encounters an error
        console.error(error);
      });
  };

  return (
    <div className='signup-container ' >
      <h2>Signup</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="contactNumber">Contact Number:</label>
          <input type="text" id="contactNumber" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} required />
        </div>
        {isLoading ? (
          <div className="loader"></div>
        ) : (
          <button type="submit">Signup</button>
        )}
      </form>
    </div>
  );
};

export default Signup;
