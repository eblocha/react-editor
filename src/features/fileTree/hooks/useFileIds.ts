import { shallowEqual, useSelector } from "react-redux";
import { selectFileIds } from "../store";
import { RootState } from "@/stores";

export const useFileIds = (id?: string) => {
  return useSelector(
    (state: RootState) => selectFileIds(state.fileTree, id) || [],
    shallowEqual
  );
};
