import { createSlice } from "@reduxjs/toolkit";
import { Directory, File, TreeItem, TreeItems } from "../types";
import { getParentAndItem, itemCanMove } from "../utils";
import {
  collapseAll,
  createDir,
  createFile,
  deleteItem,
  mergeTrees,
  move,
  rename,
  replaceTree,
  setActive,
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
  activeDir: undefined,
  activeItem: undefined,
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
 * @param parentId The parent to create the item under. If undefined, create in root
 */
function createItem(state: FileTreeState, item: TreeItem, parentId?: string) {
  const id = item.id;

  if (parentId === undefined) {
    // create in root
    state.root.push(id);
  } else {
    const parent = state.items[parentId];
    // Bail if dest is not a dir
    if (parent?.type !== TreeItems.DIR) return;

    parent.items.push(id);
  }

  // Save item data
  state.items[id] = item;
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
    });

    builder.addCase(move, (state, action) => {
      // Bail if this would create a circular reference
      if (!itemCanMove(action.payload.from, action.payload.to)) return;

      const itemId = getLast(action.payload.from);
      const destId = getLast(action.payload.to);

      // Bail - can't move root
      if (itemId === undefined) return;

      if (destId === undefined) {
        // move to root
        state.root.push(itemId);
      } else {
        const dest = state.items[destId];
        if (dest?.type !== TreeItems.DIR) return;
        // move to dest
        dest.items.push(itemId);
      }

      removeFromParent(state, action.payload.from);
    });

    builder.addCase(deleteItem, (state, action) => {
      removeFromParent(state, action.payload.path, true);
    });

    builder.addCase(createFile, (state, action) => {
      const parentId = action.payload.parent;
      const item: File = {
        id: action.payload.id,
        name: action.payload.name,
        type: TreeItems.FILE,
      };

      createItem(state, item, parentId);
    });

    builder.addCase(createDir, (state, action) => {
      const parentId = action.payload.parent;
      const item: Directory = {
        id: action.payload.id,
        name: action.payload.name,
        type: TreeItems.DIR,
        isOpen: false,
        items: [],
      };

      createItem(state, item, parentId);
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
        state.root.concat(action.payload.root);
      }
      if (action.payload.items) {
        Object.assign(state.items, action.payload.items);
      }
    });

    builder.addCase(setActive, (state, action) => {
      const { parent, item } = getParentAndItem(action.payload);

      if (item === undefined) {
        state.activeDir = undefined;
        state.activeItem = undefined;
        return;
      }

      const itemType = state.items[item]?.type;

      if (itemType === TreeItems.DIR) {
        state.activeDir = item;
      } else {
        state.activeDir = parent;
      }

      state.activeItem = item;
    });
  },
});

export const fileTreeReducer = fileTreeSlice.reducer;
