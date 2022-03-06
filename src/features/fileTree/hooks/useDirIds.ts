import { shallowEqual, useSelector } from "react-redux";
import { selectDirIds } from "../store";
import { RootState } from "@/stores";

export const useDirIds = (id?: string) => {
  return useSelector(
    (state: RootState) => selectDirIds(state.fileTree, id) || [],
    shallowEqual
  );
};
