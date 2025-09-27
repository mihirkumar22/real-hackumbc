import React from "react";
import "./AuthCard.css";

export default function AuthCard({ title, children, footer }) {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>{title}</h2>
        {children}
        {footer && <div className="auth-footer">{footer}</div>}
      </div>
    </div>
  );
}