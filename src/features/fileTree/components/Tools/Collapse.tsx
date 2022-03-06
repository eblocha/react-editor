import { AppDispatch } from "@/stores";
import { useCallback } from "react";
import { VscCollapseAll } from "react-icons/vsc";
import { useDispatch } from "react-redux";
import { collapseAll } from "../../store";

export const Collapse = () => {
  const dispatch = useDispatch<AppDispatch>();

  const handleClick = useCallback(() => {
    dispatch(collapseAll());
  }, []);

  const title = "Collapse All";

  return (
    <button
      className="text-btn block"
      onClick={handleClick}
      title={title}
      aria-label={title}
    >
      <VscCollapseAll />
    </button>
  );
};
