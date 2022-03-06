import { useClickOutside } from "@/hooks";
import React, {
  useState,
  CSSProperties,
  RefObject,
  useCallback,
  useLayoutEffect,
} from "react";

export const useContextMenu = (menuRef: RefObject<HTMLElement>) => {
  const [show, setShow] = useState(false);
  const [menuStyle, setMenuStyle] = useState<CSSProperties>({});

  useClickOutside(menuRef, () => {
    setShow(false);
  });

  const onContextMenu = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setShow(true);
    setMenuStyle({
      top: e.pageY,
      left: e.pageX,
    });
  }, []);

  useLayoutEffect(() => {
    const pos = menuRef.current?.getBoundingClientRect();
    if (show && pos) {
      setMenuStyle((style) => {
        const newStyle = { ...style };
        let modified = false;

        if (pos.right > window.innerWidth) {
          modified = true;
          newStyle.left = undefined;
          newStyle.right = 0;
        }

        if (pos.bottom > window.innerHeight) {
          modified = true;
          newStyle.top = undefined;
          newStyle.bottom = 0;
        }

        return modified ? newStyle : style;
      });
    }
  }, []);

  return { show, setShow, menuStyle, onContextMenu };
};
