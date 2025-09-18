// src/components/Header.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/AREA_Logo.webp";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      backgroundColor: "#f0f0f0",
      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      zIndex: 1000,
    }}>
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0.5rem 1rem",
      }}>
        {/* Logo cliquable */}
        <Link to="/">
          <img src={logo} alt="Logo" style={{ height: "40px", cursor: "pointer" }} />
        </Link>

        {/* Menu desktop */}
        <nav className="desktop-menu" style={{
          display: "flex",
          gap: "1rem"
        }}>
          <Link to="/login">Login</Link>
          <Link to="/signup">Signup</Link>
        </nav>

        {/* Hamburger button mobile */}
        <button 
          className="mobile-menu-button" 
          onClick={() => setMenuOpen(!menuOpen)} 
          style={{
            display: "none",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "1.5rem"
          }}
        >
          ☰
        </button>
      </div>

      {/* Menu mobile */}
      {menuOpen && (
        <nav className="mobile-menu" style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          padding: "1rem",
          backgroundColor: "#f0f0f0",
          borderTop: "1px solid #ddd"
        }}>
          <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
          <Link to="/signup" onClick={() => setMenuOpen(false)}>Signup</Link>
        </nav>
      )}

      {/* Spacer pour le header fixe */}
      <div style={{ height: "60px" }}></div>
    </header>
  );
}
