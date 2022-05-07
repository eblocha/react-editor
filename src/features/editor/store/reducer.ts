import { createSlice } from "@reduxjs/toolkit";

import { EditorState, OpenFile } from "./types";
import {
  saveFiles,
  updateContent,
  openFile,
  closeTabs,
  moveTab,
} from "./actions";
import { deleteItem } from "@/features/fileTree";
import { getLast, moveItem } from "@/utils";

export const initialState: EditorState = {
  files: {},
  tabs: {
    active: null,
    history: [],
    open: [],
  },
};

const initFile = (id: string): OpenFile => ({
  content: "",
  id,
  isDeleted: false,
  unsavedContent: null,
});

const editorSlice = createSlice({
  name: "editor",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // internal actions -------------------------------------------------------
    builder.addCase(updateContent, (state, action) => {
      const item = state.files[action.payload.id];
      if (item) {
        item.unsavedContent = action.payload.content;
      }
    });

    builder.addCase(saveFiles, (state, action) => {
      for (const id of action.payload) {
        const item = state.files[id];
        // no-op if no edits
        if (item && item.unsavedContent !== null) {
          item.content = item.unsavedContent;
          item.unsavedContent = null;
        }
      }
    });

    builder.addCase(openFile, (state, action) => {
      const index = action.payload.index ?? -1;
      const id = action.payload.id;

      if (!state.tabs.open.includes(id)) {
        // only add to the open files if it's not already open
        state.tabs.open.splice(index, 0, id);
      }

      // move id to the front of the history
      state.tabs.history = state.tabs.history.filter((i) => i !== id);
      state.tabs.history.push(id);

      // create an empty file if we don't have it
      if (!(id in state.files)) {
        state.files[id] = initFile(id);
      }

      // set the file to be active
      state.tabs.active = id;
    });

    builder.addCase(closeTabs, (state, action) => {
      // a Set of ids to remove
      const remove = new Set(
        action.payload
          .map((index) => state.tabs.open[index])
          .filter((id) => !!id)
      );

      // remove from open tabs
      state.tabs.open = state.tabs.open.filter((id) => !remove.has(id));
      // remove from history
      state.tabs.history = state.tabs.history.filter((id) => !remove.has(id));

      // set active tab to the last history item, or null if none left
      const histLen = state.tabs.history.length;
      state.tabs.active = state.tabs.history[histLen - 1] ?? null;
    });

    builder.addCase(moveTab, (state, action) => {
      const { from, to } = action.payload;
      moveItem(state.tabs.open, from, to);
    });

    // external actions we should respond to ----------------------------------
    builder.addCase(deleteItem, (state, action) => {
      // a file got deleted
      const id = getLast(action.payload.path);
      if (id) {
        if (state.tabs.open.includes(id)) {
          // the file is open, set its deleted flag
          const item = state.files[id];
          if (item) item.isDeleted = true;
        } else {
          // remove all references
          delete state.files[id];
        }
      }
    });
  },
});

export const editorReducer = editorSlice.reducer;
