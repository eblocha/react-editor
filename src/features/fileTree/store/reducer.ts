import { createSlice, freeze } from "@reduxjs/toolkit";
import { Directory, File, TreeItem, TreeItems } from "../types";
import { getParentAndItem, itemCanMove } from "../utils";
import {
  abortCreate,
  clickListItem,
  collapseAll,
  createDir,
  createFile,
  deleteItem,
  mergeTrees,
  move,
  rename,
  replaceTree,
  resetListData,
  setActive,
  startCreateDir,
  startCreateFile,
  toggleOpen,
} from "./actions";
import { FileTreeState } from "./types";
import {
  createDefaultSelectionData,
  getLast,
  resetSelectionData,
  updateSelectionData,
} from "@/utils";

export const initialState: FileTreeState = {
  dirIds: [],
  dirs: {},
  fileIds: [],
  files: {},
  selectionData: createDefaultSelectionData(),
  activeItem: [],
  addingItem: undefined,
};

/**
 * Remove data for a file. Mutates `state`.
 * @param state The file tree state
 * @param id The id of the file to remove
 */
function removeFileData(state: FileTreeState, id: string) {
  delete state.files[id];
}

/**
 * Remove data for a dir. Mutates `state`.
 * @param state The file tree state
 * @param id The id of the dir to remove
 * @param recursive Recursively remove sub-items
 */
function removeDirData(state: FileTreeState, id: string, recursive = true) {
  const item = state.dirs[id];
  if (recursive && item) {
    for (const fileId of item.fileIds) {
      removeFileData(state, fileId);
    }
    for (const dirId of item.dirIds) {
      removeDirData(state, dirId, recursive);
    }
  }
  delete state.dirs[id];
}

/**
 * Get an item by id
 * @param state The file tree state
 * @param id The item id
 * @returns The Directory or File the id refers to
 */
function getItem(state: FileTreeState, id: string) {
  return state.dirs[id] ?? state.files[id];
}

/**
 * Remove an item from its parent. Mutates `state`.
 */
function removeFromParent({
  state,
  path,
  type,
  clearData = false,
}: {
  state: FileTreeState;
  path: string[];
  type: TreeItems;
  clearData?: boolean;
}) {
  const { parent: parentId, item: itemId } = getParentAndItem(path);
  if (itemId === undefined) return;

  const isDir = type === TreeItems.DIR;

  if (parentId === undefined) {
    // Remove item from root
    if (isDir) {
      state.dirIds = state.dirIds.filter((id) => id !== itemId);
    } else {
      state.fileIds = state.fileIds.filter((id) => id !== itemId);
    }
  } else {
    const parent = state.dirs[parentId];

    if (!parent) return;

    parent.dirIds = parent.dirIds.filter((id) => id !== itemId);
  }

  if (clearData) {
    // Remove the item data
    isDir ? removeDirData(state, itemId) : removeFileData(state, itemId);
  }
}

/**
 * Create a file tree item. Mutates `state`
 * @param state The file tree state
 * @param item The item to create
 * @param parent The parent path to create the item under
 */
function createItem(state: FileTreeState, item: TreeItem, parent: string[]) {
  const id = item.id;
  // Save item data
  item.type === TreeItems.DIR
    ? (state.dirs[id] = item)
    : (state.files[id] = item);

  finalizeCreate(state, item, parent);
}

/**
 * Open all dirs along `path`. Mutates `state`.
 * @param state The file tree state
 * @param path The path along which to open dirs
 */
function openPath(state: FileTreeState, path: string[]) {
  path.forEach((id) => {
    const item = state.dirs[id];
    if (item) {
      item.isOpen = true;
    }
  });
}

/**
 * Find the index to maintain sorted order when adding an item
 * @param state The file tree state
 * @param ids The ids that already exist
 * @param item The item to insert
 * @returns The index to splice the item into
 */
function getSortedInsertIndex(
  state: FileTreeState,
  ids: string[],
  item: TreeItem
) {
  const isDir = item.type === TreeItems.DIR;
  let idx = 0;
  for (const id of ids) {
    const thisItem = isDir ? state.dirs[id] : state.files[id];
    const cmp = thisItem?.name.localeCompare(item.name);
    if (cmp === undefined) continue;

    if (cmp >= 0) {
      // same name
      break;
    }
    idx++;
  }
  return idx;
}

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
 * Finalize object creation by adding its id to the parent, opening all parent dirs, and setting the item active. Mutates `state`.
 * @param state The file tree state
 * @param item The item that was created or moved
 * @param parent The path of the parent dir
 */
function finalizeCreate(
  state: FileTreeState,
  item: TreeItem,
  parent: string[]
) {
  const id = item.id;
  const parentId = getLast(parent);

  const isDir = item.type === TreeItems.DIR;

  if (parentId === undefined) {
    // create in root
    const idx = getSortedInsertIndex(
      state,
      isDir ? state.dirIds : state.fileIds,
      item
    );

    isDir ? state.dirIds.splice(idx, 0, id) : state.fileIds.splice(idx, 0, id);
  } else {
    const parent = state.dirs[parentId];
    // Bail if dest is not a dir
    if (!parent) return;

    const idx = getSortedInsertIndex(
      state,
      isDir ? parent.dirIds : parent.fileIds,
      item
    );

    isDir
      ? parent.dirIds.splice(idx, 0, id)
      : parent.fileIds.splice(idx, 0, id);
  }

  // Ensure all dirs are open for visibility
  openPath(state, parent);

  // Make the new item active
  state.activeItem = [...parent, item.id];

  // Set adding item to empty
  state.addingItem = undefined;
}

const fileTreeSlice = createSlice({
  name: "fileTree",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(toggleOpen, (state, action) => {
      const dir = state.dirs[action.payload];
      if (!dir) return;
      dir.isOpen = !dir.isOpen;
    });

    builder.addCase(collapseAll, (state) => {
      Object.keys(state.dirs).forEach((id) => {
        const item = state.dirs[id];
        if (item) {
          item.isOpen = false;
        }
      });

      // Set active item as the first item, or empty
      const base = state.activeItem[0];
      state.activeItem = base ? [base] : [];
    });

    builder.addCase(move, (state, action) => {
      // Bail if this would create a circular reference
      if (!itemCanMove(action.payload.from, action.payload.to)) return;

      const itemId = getLast(action.payload.from);

      // Bail - can't move root
      if (itemId === undefined) return;

      const item = getItem(state, itemId);

      // Bail - item does not exist
      if (!item) return;

      const destId = getLast(action.payload.to);

      // Bail - dest is not a dir or does not exist
      if (!destId || getItem(state, destId)?.type !== TreeItems.DIR) {
        return;
      }

      removeFromParent({ state, path: action.payload.from, type: item.type });
      finalizeCreate(state, item, action.payload.to);
    });

    builder.addCase(deleteItem, (state, action) => {
      const id = getLast(action.payload.path);
      const isDir = id && id in state.dirs;

      removeFromParent({
        state,
        path: action.payload.path,
        type: isDir ? TreeItems.DIR : TreeItems.FILE,
        clearData: true,
      });
    });

    builder.addCase(createFile, (state, action) => {
      const item: File = {
        id: action.payload.id,
        name: action.payload.name,
        type: TreeItems.FILE,
      };

      createItem(state, item, action.payload.parent);
    });

    builder.addCase(createDir, (state, action) => {
      const item: Directory = {
        id: action.payload.id,
        name: action.payload.name,
        type: TreeItems.DIR,
        isOpen: false,
        dirIds: [],
        fileIds: [],
      };

      createItem(state, item, action.payload.parent);
    });

    builder.addCase(rename, (state, action) => {
      const id = action.payload.id;
      const name = action.payload.name;

      const base = getItem(state, id);

      if (base === undefined) return;

      base.name = name;
    });

    builder.addCase(replaceTree, (_state, action) => {
      return action.payload;
    });

    builder.addCase(mergeTrees, (state, action) => {
      if (action.payload.dirs) {
        Object.assign(state.dirs, action.payload.dirs);
      }

      if (action.payload.files) {
        Object.assign(state.files, action.payload.files);
      }

      if (action.payload.dirIds) {
        const newIds = Array.from(
          new Set([...freeze(state.dirIds), ...action.payload.dirIds])
        );
        state.dirIds = getSortedDirs(state, newIds);
      }

      if (action.payload.fileIds) {
        const newIds = Array.from(
          new Set([...freeze(state.fileIds), ...action.payload.fileIds])
        );
        state.fileIds = getSortedFiles(state, newIds);
      }
    });

    builder.addCase(setActive, (state, action) => {
      state.activeItem = action.payload;
    });

    builder.addCase(startCreateDir, (state, action) => {
      state.addingItem = {
        path: action.payload,
        type: TreeItems.DIR,
      };
      // Ensure parent is open
      openPath(state, action.payload);
    });

    builder.addCase(startCreateFile, (state, action) => {
      state.addingItem = {
        path: action.payload,
        type: TreeItems.FILE,
      };
      // Ensure parent is open
      openPath(state, action.payload);
    });

    builder.addCase(abortCreate, (state) => {
      state.addingItem = undefined;
    });

    builder.addCase(clickListItem, (state, action) => {
      updateSelectionData(
        state.selectionData,
        action.payload.event,
        action.payload.index
      );
    });

    builder.addCase(resetListData, (state) => {
      resetSelectionData(state.selectionData);
    });
  },
});

export const fileTreeReducer = fileTreeSlice.reducer;
