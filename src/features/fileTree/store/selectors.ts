import { getLast } from "@/utils";
import { createSelector } from "@reduxjs/toolkit";
import { Directory, File, TreeItem, TreeItems } from "../types";
import { FileTreeState } from "./types";

/**
 * .sort compareFn for tree items to sort by name
 */
const treeSorter = (a: TreeItem, b: TreeItem) => a.name.localeCompare(b.name);

/**
 * Sort dirs by name
 * @param state The file tree state
 * @param ids The dir ids to sort
 * @returns The ids, sorted by name
 */
const getSortedDirs = (state: FileTreeState, ids: string[]) => {
  return ids
    .map((id) => state.dirs[id])
    .filter((item): item is Directory => !!item)
    .sort(treeSorter)
    .map((dir) => dir.id);
};

/**
 * Sort files by name
 * @param state The file tree state
 * @param ids The file ids to sort
 * @returns The ids, sorted by name
 */
const getSortedFiles = (state: FileTreeState, ids: string[]) => {
  return ids
    .map((id) => state.files[id])
    .filter((item): item is File => !!item)
    .sort(treeSorter)
    .map((file) => file.id);
};

/**
 * Select an item
 * @param state The file tree state
 * @param id The id of the item to select
 * @returns The Directory or File item the id refers to
 */
export const selectItem = (
  state: FileTreeState,
  id: string
): TreeItem | undefined => {
  return state.dirs[id] ?? state.files[id];
};

/**
 * Select child dir ids for an item
 * @param state The file tree state
 * @param id The dir id to select dirs for. If undefined, gives root dirs
 * @returns The dir ids, or undefined if item does not exist
 */
export const selectDirIds = (state: FileTreeState, id?: string) => {
  return id ? state.dirs[id]?.dirIds : state.dirIds;
};

/**
 * Select child file ids for an item
 * @param state The file tree state
 * @param id The dir id to select files for. If undefined, gives root files
 * @returns The file ids, or undefined if item does not exist
 */
export const selectFileIds = (state: FileTreeState, id?: string) => {
  return id ? state.dirs[id]?.fileIds : state.fileIds;
};

/**
 * Make a selector to select dir ids, sorted for display
 * @param id The item id to select dirs for, or root if undefined
 * @returns A selector to get the sorted dir ids
 */
export const makeSelectSortedDirs = (id?: string) =>
  createSelector(
    (state: FileTreeState) => state,
    (state: FileTreeState) => selectDirIds(state, id),
    (state, ids) => (ids ? getSortedDirs(state, ids) : [])
  );

/**
 * Make a selector to select file ids, sorted for display
 * @param id The item id to select files for, or root if undefined
 * @returns A selector to get the sorted file ids
 */
export const makeSelectSortedFiles = (id?: string) =>
  createSelector(
    (state: FileTreeState) => state,
    (state: FileTreeState) => selectFileIds(state, id),
    (state, ids) => (ids ? getSortedFiles(state, ids) : [])
  );

/**
 * Select the active dir, where new items should be placed
 */
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
