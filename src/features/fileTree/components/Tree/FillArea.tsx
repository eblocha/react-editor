import { AppDispatch } from "@/stores";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { setActive } from "../../store";
import styles from "../TreeItem.module.css";

export const FillArea = () => {
  const dispatch = useDispatch<AppDispatch>();

  const handleClick = useCallback(() => {
    dispatch(setActive([]));
  }, [dispatch]);

  return (
    <div
      className={`h-full w-full ${styles.treeFocusable}`}
      tabIndex={0}
      onClick={handleClick}
    />
  );
};
