import { createSelector } from "@reduxjs/toolkit";
import { Directory, File, TreeItem, TreeItems } from "../types";
import { FileTreeState } from "./types";

const treeSorter = (a: TreeItem, b: TreeItem) => a.name.localeCompare(b.name);

const getSortedDirs = (ids: string[], state: FileTreeState) => {
  return ids
    .map((id) => state.items[id])
    .filter((item): item is Directory => item?.type === TreeItems.DIR)
    .sort(treeSorter)
    .map((dir) => dir.id);
};

const getSortedFiles = (ids: string[], state: FileTreeState) => {
  return ids
    .map((id) => state.items[id])
    .filter((item): item is File => item?.type === TreeItems.FILE)
    .sort(treeSorter)
    .map((file) => file.id);
};

const getSorted = (ids: string[], state: FileTreeState) => {
  return [...getSortedDirs(ids, state), ...getSortedFiles(ids, state)];
};

export const selectItem = (
  state: FileTreeState,
  id: string
): TreeItem | undefined => {
  return state.items[id];
};

export const selectChildrenIds = (state: FileTreeState, id?: string) => {
  if (!id) return state.root;

  const item = selectItem(state, id);
  if (item?.type === TreeItems.DIR) {
    return item.items;
  } else {
    return [];
  }
};

/**
 * Make a selector that sorts item ids for display. Places dirs first, then files. Sorts each group by name.
 * @param id The id of the directory to get sorted children for
 * @returns The ids of the directory, sorted for display
 */
export const makeSelectSortedChildren = (id?: string) =>
  createSelector(
    (state: FileTreeState) => selectChildrenIds(state, id),
    (state: FileTreeState) => state,
    getSorted
  );
