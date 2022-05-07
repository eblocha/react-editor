import { createAction } from "@reduxjs/toolkit";

/** Update the unsaved content of a file */
export const updateContent = createAction<{
  id: string;
  content: string;
}>("updateContent");

/** Save files by id (swap content for unsavedContent) */
export const saveFiles = createAction<string[]>("saveFiles");

/** Open a file, optionally choose an index in the open tabs (defaults to the end) */
export const openFile = createAction<{ id: string; index?: number }>(
  "openFile"
);

/** Close multiple tabs by index */
export const closeTabs = createAction<number[]>("closeFiles");

/** Move an open tab */
export const moveTab = createAction<{
  from: number;
  to: number;
}>("moveFile");
