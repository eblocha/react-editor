import { createSlice } from "@reduxjs/toolkit";
import { Directory, File, TreeItem, TreeItems } from "../types";
import { getParentAndItem, itemCanMove } from "../utils";
import {
  abortCreate,
  collapseAll,
  createDir,
  createFile,
  deleteItem,
  mergeTrees,
  move,
  rename,
  replaceTree,
  setActive,
  startCreateDir,
  startCreateFile,
  toggleOpen,
} from "./actions";
import { FileTreeState } from "./types";
import { getLast } from "@/utils";

const initialState: FileTreeState = {
  root: ["a", "b", "d"],
  items: {
    a: {
      id: "a",
      isOpen: false,
      items: ["c"],
      name: "About Me",
      type: TreeItems.DIR,
    },
    b: {
      id: "b",
      type: TreeItems.FILE,
      name: "Resume.txt",
    },
    c: {
      id: "c",
      type: TreeItems.DIR,
      isOpen: false,
      items: [],
      name: "Pictures",
    },
    d: {
      id: "d",
      type: TreeItems.DIR,
      isOpen: false,
      items: [],
      name: "Projects",
    },
  },
  activeItem: [],
};

/**
 * Remove an item from its parent. Mutates `state`.
 * @param state The file tree state
 * @param path The path to remove from its parent
 * @param clearData Remove the item data as well
 */
function removeFromParent(
  state: FileTreeState,
  path: string[],
  clearData = false
) {
  const { parent: parentId, item: itemId } = getParentAndItem(path);
  if (itemId === undefined) return;

  // Remove item from parent
  if (parentId === undefined) {
    state.root = state.root.filter((id) => id !== itemId);
  } else {
    const parent = state.items[parentId];

    if (!parent || parent.type !== TreeItems.DIR) return;

    parent.items = parent.items.filter((id) => id !== itemId);
  }

  if (clearData) {
    // Remove the item data
    delete state.items[itemId];
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
  state.items[id] = item;

  finalizeCreate(state, item, parent);
}

function openPath(state: FileTreeState, path: string[]) {
  path.forEach((id) => {
    const item = state.items[id];
    if (item?.type === TreeItems.DIR) {
      item.isOpen = true;
    }
  });
}

/**
 * Finalize object creation by adding its id to the parent, opening all parent dirs, and setting the item active
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

  if (parentId === undefined) {
    // create in root
    state.root.push(id);
  } else {
    const parent = state.items[parentId];
    // Bail if dest is not a dir
    if (parent?.type !== TreeItems.DIR) return;

    parent.items.push(id);
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
      const dir = state.items[action.payload];
      if (!dir || dir.type !== TreeItems.DIR) return;
      dir.isOpen = !dir.isOpen;
    });

    builder.addCase(collapseAll, (state) => {
      Object.keys(state.items).forEach((id) => {
        const item = state.items[id];
        if (item?.type === TreeItems.DIR) {
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

      const item = state.items[itemId];

      // Bail - item does not exist
      if (!item) return;

      removeFromParent(state, action.payload.from);
      finalizeCreate(state, item, action.payload.to);
    });

    builder.addCase(deleteItem, (state, action) => {
      removeFromParent(state, action.payload.path, true);
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
        items: [],
      };

      createItem(state, item, action.payload.parent);
    });

    builder.addCase(rename, (state, action) => {
      const id = action.payload.id;
      const name = action.payload.name;

      const base = state.items[id];

      if (base === undefined) return;

      base.name = name;
    });

    builder.addCase(replaceTree, (_state, action) => {
      return action.payload;
    });

    builder.addCase(mergeTrees, (state, action) => {
      if (action.payload.root) {
        state.root = state.root.concat(action.payload.root);
      }
      if (action.payload.items) {
        Object.assign(state.items, action.payload.items);
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
  },
});

export const fileTreeReducer = fileTreeSlice.reducer;
