import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import LandingPage from './components/LandingPage';
import './App.css';

const App = () => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route
            path="/login"
            element={user ? <Navigate to="/home" /> : <Login onLogin={setUser} />}
          />
          <Route
            path="/home"
            element={user ? <LandingPage userName={user} /> : <Navigate to="/login" />}
          />
          <Route path="*" element={<Navigate to={user ? "/home" : "/login"} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;