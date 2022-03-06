import { AppDispatch, RootState } from "@/stores";
import { useCallback } from "react";
import { VscNewFile } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import { createFile } from "../../store";

export const AddFile = () => {
  const title = "New File";

  const dispatch = useDispatch<AppDispatch>();
  const activeDir = useSelector((state: RootState) => state.fileTree.activeDir);

  const handleClick = useCallback(() => {
    dispatch(
      createFile({
        name: "New File",
        parent: activeDir,
      })
    );
  }, [activeDir, dispatch]);

  return (
    <button
      className="text-btn block"
      title={title}
      aria-label={title}
      onClick={handleClick}
    >
      <VscNewFile />
    </button>
  );
};
