import React, { forwardRef } from "react";
import "./ContextMenu.css";

export const ContextMenu = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ children, className, ...props }, ref) => (
  <div
    data-testid="test-component"
    className={`context-menu ${className || ""}`}
    {...props}
    ref={ref}
  >
    {children}
  </div>
));
