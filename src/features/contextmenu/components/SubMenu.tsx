import React, { useCallback, useLayoutEffect, useRef, useState } from "react";
import { ContextMenu } from "./ContextMenu";
import "./ContextMenu.css";

export type SubMenuProps = React.HTMLAttributes<HTMLDivElement> & {
  label: string;
  disabled?: boolean;
};

export const SubMenu: React.FC<SubMenuProps> = ({
  children,
  className,
  label,
  disabled,
  ...props
}) => {
  const [hovering, setHovering] = useState(false);
  const [subStyle, setSubStyle] = useState<React.CSSProperties>({});

  const ref = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!hovering) return;
    const pos = ref.current?.getBoundingClientRect();
    const subPos = subRef.current?.getBoundingClientRect();

    if (pos && subPos) {
      setSubStyle((style) => {
        const newStyle = { ...style };
        if (subPos.right > window.innerWidth) {
          newStyle.left = undefined;
          newStyle.right = pos.width + (window.innerWidth - pos.right);
        }
        if (subPos.bottom > window.innerHeight) {
          newStyle.top = undefined;
          newStyle.bottom = 0;
        }
        return newStyle;
      });
    }
  }, [hovering]);

  const handleMouseEnter = useCallback(() => {
    if (disabled) {
      setHovering(false);
      return;
    }
    setHovering(true);
    const pos = ref.current?.getBoundingClientRect();

    const top = pos ? pos.top - 4 : undefined;

    const left = pos?.right;

    setSubStyle({ top, left });
  }, [disabled]);

  const handleMouseLeave = useCallback(() => setHovering(false), []);

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleMouseEnter}
      className={`context-menu-submenu ${
        disabled ? "opacity-50" : "cursor-pointer"
      }`}
      ref={ref}
      tabIndex={0}
      {...props}
    >
      <span className="mr-2">{label}</span>
      {hovering && (
        <ContextMenu style={subStyle} ref={subRef}>
          {children}
        </ContextMenu>
      )}
    </div>
  );
};
