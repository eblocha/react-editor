import { AppDispatch, RootState } from "@/stores";
import { useCallback } from "react";
import { VscNewFile } from "react-icons/vsc";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { selectActiveDir, startCreateFile } from "../../store";

export const AddFile = () => {
  const title = "New File";

  const dispatch = useDispatch<AppDispatch>();
  const activeDir = useSelector(
    (state: RootState) => selectActiveDir(state.fileTree),
    shallowEqual
  );

  const handleClick = useCallback(() => {
    dispatch(startCreateFile(activeDir));
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
