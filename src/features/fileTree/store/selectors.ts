import { arraysEqual, getLast } from "@/utils";
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

export type TreeListProps = {
  ids: string[];
  paths: string[];
  namePaths: string[];
};

/**
 * Select ids, paths, and name paths for rendering the file tree
 * @param state The file tree state
 * @param dirId
 * @param path
 * @param namePath
 * @returns The file tree state for rendering
 */
export const selectTreeListProps = (
  state: FileTreeState,
  dirId?: string,
  path = "",
  namePath = ""
): TreeListProps => {
  const dirItem = dirId ? state.dirs[dirId] : state;

  // Doesn't exist
  if (!dirItem)
    return {
      ids: [],
      namePaths: [],
      paths: [],
    };

  // The path with the new item id appended
  const newPath = dirId ? appendPath(path, dirId) : path;
  // The namePath with the new item name appended
  const newNamePath = dirId
    ? appendPath(namePath, (dirItem as Directory).name)
    : namePath;

  const pathState: TreeListProps =
    dirId && dirItem
      ? {
          ids: [dirId],
          paths: [newPath],
          namePaths: [newNamePath],
        }
      : {
          ids: [],
          namePaths: [],
          paths: [],
        };

  // Directory is not open - do not render children
  if (dirId && !(dirItem as Directory).isOpen) return pathState;

  // Add child dirs
  for (const id of dirItem.dirIds) {
    // Recurse through children
    const { ids, namePaths, paths } = selectTreeListProps(
      state,
      id,
      newPath,
      newNamePath
    );
    pathState.paths.push(...paths);
    pathState.namePaths.push(...namePaths);
    pathState.ids.push(...ids);
  }

  // Push files
  for (const id of dirItem.fileIds) {
    const fileItem = state.files[id];
    if (!fileItem) continue;
    pathState.ids.push(id);
    pathState.paths.push(appendPath(newPath, id));
    pathState.namePaths.push(appendPath(newNamePath, fileItem.name));
  }

  return pathState;
};

/** Compare function for tree props selector */
export const compareTreeProps = (prev: TreeListProps, next: TreeListProps) => {
  return (
    prev === next ||
    (arraysEqual(prev.ids, next.ids) &&
      arraysEqual(prev.namePaths, next.namePaths) &&
      arraysEqual(prev.paths, next.paths))
  );
};

/** Make a caching selector for `selectTreeListProps` */
export const makeSelectTreeListProps = () =>
  createSelector(
    (state: FileTreeState) => state,
    (_state: FileTreeState, dirId?: string) => dirId,
    (_state: FileTreeState, _dirId?: string, path?: string) => path,
    (
      _state: FileTreeState,
      _dirId?: string,
      _path?: string,
      namePath?: string
    ) => namePath,
    selectTreeListProps
  );
