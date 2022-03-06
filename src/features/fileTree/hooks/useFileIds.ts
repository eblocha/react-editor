import { useMemo } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { makeSelectSortedFiles } from "../store";
import { RootState } from "@/stores";

export const useFileIds = (id?: string) => {
  const selector = useMemo(() => makeSelectSortedFiles(id), [id]);

  return useSelector(
    (state: RootState) => selector(state.fileTree),
    shallowEqual
  );
};
