import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';
import Hitachi from "../assets/Hitachi.svg"

const Header = ({ userName }) => {
    const [showLogout, setShowLogout] = useState(false);
    const navigate = useNavigate();
    const firstLetter = userName ? userName.charAt(0).toUpperCase() : 'U';

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login', { replace: true });
        window.location.href = '/login';
    };

    return (
        <header className="header">
            <div className="logo">
                <img src={Hitachi} alt="Hitachi Logo" />
            </div>
            <div
                className="user-info"
                onClick={() => setShowLogout(!showLogout)}
            >
                <span>{userName}</span>
                <div className="avatar">{firstLetter}</div>
                {showLogout && (
                    <button className="logout-button" onClick={handleLogout}>
                        Logout
                    </button>
                )}
            </div>
        </header>
    );
};

export default Header;