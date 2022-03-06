import React, { forwardRef } from "react";
import "./ContextMenu.css";

const MenuItem = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ children, className, ...props }, ref) => (
  <button
    className={`context-menu-item ${className || ""}`}
    ref={ref}
    {...props}
  >
    {children}
  </button>
));

MenuItem.displayName = "MenuItem";

export { MenuItem };
