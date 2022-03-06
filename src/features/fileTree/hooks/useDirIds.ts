import { useMemo } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { makeSelectSortedDirs } from "../store";
import { RootState } from "@/stores";

export const useDirIds = (id?: string) => {
  const selector = useMemo(() => makeSelectSortedDirs(id), [id]);

  return useSelector(
    (state: RootState) => selector(state.fileTree),
    shallowEqual
  );
};
