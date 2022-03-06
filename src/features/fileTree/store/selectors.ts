import { getLast } from "@/utils";
import { createSelector } from "@reduxjs/toolkit";
import { TreeItem, TreeItems } from "../types";
import { FileTreeState } from "./types";

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

/**
 * Select whether a file is being added
 */
export const selectAddingFile = (state: FileTreeState) =>
  state.addingItem?.type === TreeItems.FILE;

/**
 * Select whether an item is being added to `id`
 * @param state The file tree state
 * @param id The id to query
 * @returns Whether an item is being added to `id`
 */
export const selectAddingToId = (state: FileTreeState, id?: string) => {
  const path = state.addingItem?.path;
  return path ? getLast(path) === id : false;
};
