import { getLast } from "@/utils";
import { createSelector } from "@reduxjs/toolkit";
import { Directory, TreeItem, TreeItems } from "../types";
import { appendPath } from "../utils";
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

/**
 * Determine if a file is the first file inside a dir
 * @param state The file tree state
 * @param id The file id
 * @param dirId The dir id
 * @returns Whether `id` is the first file under the dir
 */
export const selectIsFirstFile = (
  state: FileTreeState,
  id: string,
  dirId?: string
) => {
  const dirItem = dirId ? state.dirs[dirId] : state;

  if (!dirItem) return false;

  return dirItem.fileIds[0] === id;
};

/**
 * Select ids listed for display
 * @param state The file tree state
 * @param dirId select ids for this dir. If undefined, lists all ids for root dir
 * @returns The ids listed for display
 */
export const selectAllIds = (
  state: FileTreeState,
  dirId?: string
): string[] => {
  const dirItem = dirId ? state.dirs[dirId] : state;

  const ids: string[] = [];

  if (!dirItem) return ids;
  // Not open - show nothing
  if (dirId && !(dirItem as Directory).isOpen) return ids;

  for (const id of dirItem.dirIds) {
    // push the child dir id
    ids.push(id);
    // push the child's children
    ids.push(...selectAllIds(state, id));
  }

  // push file ids
  ids.push(...dirItem.fileIds);

  return ids;
};

/** Make a caching selector for `selectAllIds` */
export const makeSelectAllIds = () =>
  createSelector(
    (state: FileTreeState) => state,
    (_state: FileTreeState, dirId?: string) => dirId,
    selectAllIds
  );

/**
 * Select list of paths, corresponding to the return value from `selectAllIds`
 * @param state The file tree state
 * @param dirId The dir id to select paths for
 * @param basePath The path of the dir
 * @returns The paths for each item, corresponding to the return value from `selectAllIds`
 */
export const selectAllPaths = (
  state: FileTreeState,
  dirId?: string,
  basePath = ""
): string[] => {
  const dirItem = dirId ? state.dirs[dirId] : state;

  // The base path with the new item id appended
  const newBase = dirId ? appendPath(basePath, dirId) : basePath;

  const paths: string[] = [];

  if (!dirItem) return paths;
  // Not open - show nothing
  if (dirId && !(dirItem as Directory).isOpen) return paths;

  for (const id of dirItem.dirIds) {
    // push the id appended to base path
    paths.push(appendPath(newBase, id));
    // push the child's children
    paths.push(...selectAllPaths(state, id, newBase));
  }

  // Push files
  paths.push(...dirItem.fileIds.map((id) => appendPath(newBase, id)));

  return paths;
};

/** Make a caching selector for `selectAllPaths` */
export const makeSelectAllPaths = () =>
  createSelector(
    (state: FileTreeState) => state,
    (_state: FileTreeState, dirId?: string) => dirId,
    (_state: FileTreeState, _dirId?: string, basePath?: string) => basePath,
    selectAllPaths
  );
