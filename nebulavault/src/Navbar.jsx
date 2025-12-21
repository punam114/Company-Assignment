import React from "react";
import { NavLink } from "react-router-dom";
import { Atom, Ghost, Scroll } from 'lucide-react';

export default function Navbar() {
    const linkStyle = ({ isActive }) => ({
        display: "flex",
        alignItems: "center",
        gap: '8px',
        padding: '10px 16px',
        textDecoration: "none",
        border: '1px solid #d1d5db',
        borderRadius: "6px",
        backgroundColor: isActive ? '#3b82f6' : 'white',
        color: isActive ? 'white' : '#374151',
        transition: 'all 0.2s ease'
    });

    return (
        <nav style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
            <NavLink to="/artifacts" style={linkStyle}>
                <Atom size={18} />
                Artifacts
            </NavLink>
            
            <NavLink to='/creatures' style={linkStyle}>
                <Ghost size={18} />
                Creatures
            </NavLink>

            <NavLink to='/logs' style={linkStyle}>
                <Scroll size={18} />
                Logs
            </NavLink>
        </nav>
    );
}