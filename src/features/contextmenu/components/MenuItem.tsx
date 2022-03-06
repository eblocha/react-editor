import React from "react";
import "./ContextMenu.css";

export const MenuItem: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ children, className, ...props }, ref) => (
  <button
    className={`context-menu-item ${className || ""}`}
    ref={ref}
    {...props}
  >
    {children}
  </button>
);
