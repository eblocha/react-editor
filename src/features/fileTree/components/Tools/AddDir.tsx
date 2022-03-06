import { AppDispatch, RootState } from "@/stores";
import { useCallback } from "react";
import { VscNewFolder } from "react-icons/vsc";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { createDir, selectActiveDir } from "../../store";

export const AddDir = () => {
  const title = "New Folder";

  const dispatch = useDispatch<AppDispatch>();
  const activeDir = useSelector(
    (state: RootState) => selectActiveDir(state.fileTree),
    shallowEqual
  );

  const handleClick = useCallback(() => {
    dispatch(
      createDir({
        name: "New Folder",
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
      <VscNewFolder />
    </button>
  );
};
