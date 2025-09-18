// src/components/Card.tsx
import React from "react";

interface CardProps {
  image: string;
  title: string;
  description: string;
  buttonText?: string;
  onButtonClick?: () => void;
}

export default function Card({ image, title, description, buttonText, onButtonClick }: CardProps) {
  return (
    <div style={{
      width: "300px",
      border: "1px solid #ddd",
      borderRadius: "12px",
      overflow: "hidden",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      display: "flex",
      flexDirection: "column",
      transition: "transform 0.2s",
      cursor: "pointer"
    }}
    onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
    onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
    >
      {/* Image */}
      <img src={image} alt={title} style={{ width: "100%", height: "180px", objectFit: "cover" }} />

      {/* Contenu */}
      <div style={{ padding: "1rem", flexGrow: 1 }}>
        <h3 style={{ margin: "0 0 0.5rem 0" }}>{title}</h3>
        <p style={{ margin: "0 0 1rem 0", color: "#555" }}>{description}</p>
        {buttonText && (
          <button 
            onClick={onButtonClick} 
            style={{
              padding: "0.5rem 1rem",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer"
            }}
          >
            {buttonText}
          </button>
        )}
      </div>
    </div>
  );
}
