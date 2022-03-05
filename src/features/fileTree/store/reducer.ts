import { createSlice, SliceCaseReducers } from "@reduxjs/toolkit";
import { Directory, File, TreeItem, TreeItems } from "../types";
import { itemCanMove } from "../utils";
import {
  CreateDirAction,
  CreateFileAction,
  DeleteAction,
  MergeTreesAction,
  MoveAction,
  OpenAction,
  RenameAction,
  ReplaceTreeAction,
} from "./actions";
import { FileTreeState } from "./types";
import { getLast } from "@/utils/arrays";
import { v4 as uuid4 } from "uuid";

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
  const parentIdSlice = path.slice(-2);

  const base = parentIdSlice[0];

  if (base === undefined) return;

  // Remove item from parent
  if (parentIdSlice.length === 1) {
    state.root = state.root.filter((id) => id !== base);
  } else {
    const itemId = parentIdSlice[1];

    const parent = state.items[base];

    if (!parent || parent.type !== TreeItems.DIR) return;

    parent.items = parent.items.filter((id) => id !== itemId);
  }

  if (clearData) {
    // Remove the item data
    delete state.items[base];
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

function prepareItem(name: string, parent?: string) {
  return {
    id: uuid4(),
    name,
    parent,
  };
}

const reducers: SliceCaseReducers<FileTreeState> = {
  toggleOpen(state, action: OpenAction) {
    const dir = state.items[action.payload];
    if (!dir || dir.type !== TreeItems.DIR) return;
    dir.isOpen = !dir.isOpen;
  },
  move(state, action: MoveAction) {
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
  },
  deleteItem(state, action: DeleteAction) {
    removeFromParent(state, action.payload.path, true);
  },
  createFile: {
    reducer: (state, action: CreateFileAction) => {
      const parentId = action.payload.parent;
      const item: File = {
        id: action.payload.id,
        name: action.payload.name,
        type: TreeItems.FILE,
      };

      createItem(state, item, parentId);
    },
    prepare: (name: string, parent?: string) => {
      return {
        payload: prepareItem(name, parent) as CreateFileAction["payload"],
      };
    },
  },
  createDir: {
    reducer: (state, action: CreateDirAction) => {
      const parentId = action.payload.parent;
      const item: Directory = {
        id: action.payload.id,
        name: action.payload.name,
        type: TreeItems.DIR,
        isOpen: false,
        items: [],
      };

      createItem(state, item, parentId);
    },
    prepare: (name: string, parent?: string) => {
      return {
        payload: prepareItem(name, parent) as CreateDirAction["payload"],
      };
    },
  },
  rename(state, action: RenameAction) {
    const id = action.payload.id;
    const name = action.payload.name;

    const base = state.items[id];

    if (base === undefined) return;

    base.name = name;
  },
  replace(_state, action: ReplaceTreeAction) {
    return action.payload;
  },
  merge(state, action: MergeTreesAction) {
    if (action.payload.root) {
      state.root.concat(action.payload.root);
    }
    if (action.payload.items) {
      Object.assign(state.items, action.payload.items);
    }
  },
};

const fileTreeSlice = createSlice({
  name: "fileTree",
  initialState,
  reducers,
});

export const {
  toggleOpen,
  move,
  deleteItem,
  createFile,
  createDir,
  rename,
  replace,
  merge,
} = fileTreeSlice.actions;
export const fileTreeReducer = fileTreeSlice.reducer;
