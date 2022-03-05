import { useMemo } from "react";
import { useSelector } from "react-redux";
import { makeSelectSortedChildren } from "../store";
import { RootState } from "@/stores";

export const useChildIds = (id?: string) => {
  const selectChildIds = useMemo(() => makeSelectSortedChildren(id), [id]);

  return useSelector((state: RootState) => selectChildIds(state.fileTree));
};
