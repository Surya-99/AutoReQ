import React, { useState } from 'react';
import './Login.css';
import Hitachi_Logo from "../assets/Hitachi_Logo.svg";

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/users');
            const users = await response.json();
            const user = users.find(u => u.email === email && u.password === password);
            if (user) {
                onLogin(user.name);
            } else {
                setError('Invalid email or password');
            }
        } catch (error) {
            setError('Error connecting to server');
            console.error('Fetch error:', error);
        }
    };

    return (
        <div className="login-container">
            <div className="hitachi-logo">
                <img src={Hitachi_Logo} alt="Hitachi" />
            </div>
            <form onSubmit={handleSubmit} className="login-form">
                <h2 className="txt">Login</h2>
                <input
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="login-input"
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="login-input"
                />
                {error && <p className="error">{error}</p>}
                <button type="submit" className="login-button">Sign In</button>
                <p className="forgot-password">
                    <a href="">Forgot Password?</a>
                </p>
            </form>
        </div>
    );
};

export default Login;