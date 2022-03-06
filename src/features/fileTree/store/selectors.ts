import { getLast } from "@/utils";
import { createSelector } from "@reduxjs/toolkit";
import { Directory, File, TreeItem, TreeItems } from "../types";
import { FileTreeState } from "./types";

const treeSorter = (a: TreeItem, b: TreeItem) => a.name.localeCompare(b.name);

const getSortedDirs = (state: FileTreeState, ids: string[]) => {
  return ids
    .map((id) => state.dirs[id])
    .filter((item): item is Directory => !!item)
    .sort(treeSorter)
    .map((dir) => dir.id);
};

const getSortedFiles = (state: FileTreeState, ids: string[]) => {
  return ids
    .map((id) => state.files[id])
    .filter((item): item is File => !!item)
    .sort(treeSorter)
    .map((file) => file.id);
};

export const selectItem = (
  state: FileTreeState,
  id: string
): TreeItem | undefined => {
  return state.dirs[id] ?? state.files[id];
};

export const selectDirIds = (state: FileTreeState, id?: string) => {
  return id ? state.dirs[id]?.dirIds : state.dirIds;
};

export const selectFileIds = (state: FileTreeState, id?: string) => {
  return id ? state.dirs[id]?.fileIds : state.fileIds;
};

export const makeSelectSortedDirs = (id?: string) =>
  createSelector(
    (state: FileTreeState) => state,
    (state: FileTreeState) => selectDirIds(state, id),
    (state, ids) => (ids ? getSortedDirs(state, ids) : [])
  );

export const makeSelectSortedFiles = (id?: string) =>
  createSelector(
    (state: FileTreeState) => state,
    (state: FileTreeState) => selectFileIds(state, id),
    (state, ids) => (ids ? getSortedFiles(state, ids) : [])
  );

export const selectActiveDir = createSelector(
  (state: FileTreeState) => state,
  (state: FileTreeState): string[] => {
    const activeItem = state.activeItem;
    const itemId = getLast(activeItem);

    if (!itemId) return [];

    const item = selectItem(state, itemId);

    if (!item) return [];

    if (item.type === TreeItems.DIR) {
      return activeItem;
    } else {
      return activeItem.slice(0, -1);
    }
  }
);
