import { RefObject, useEffect, useRef } from "react";

type Callback = (e: MouseEvent) => void;

export const useClickOutside = (
  ref: RefObject<HTMLElement>,
  callback: Callback
) => {
  const cbkRef = useRef<Callback>();
  cbkRef.current = callback;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!ref?.current?.contains(e.target as Node) && cbkRef.current) {
        cbkRef.current(e);
      }
    };

    document.addEventListener("click", handleClickOutside, true);
    document.addEventListener("contextmenu", handleClickOutside, true);

    return () => {
      document.removeEventListener("click", handleClickOutside, true);
      document.removeEventListener("contextmenu", handleClickOutside, true);
    };
  }, []);
};
