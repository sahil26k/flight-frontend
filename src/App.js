import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UserHome from './components/UserHome';
import Login from './components/Login';
import Signup from './components/Signup';
import AdminHome from './components/AdminHome';
const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/userhome" element={<UserHome />} />
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/adminhome" element={<AdminHome />} />        
      </Routes>
    </BrowserRouter>
  );
};

export default App;
