import { getLast } from "@/utils";
import { createAction, createAsyncThunk, nanoid } from "@reduxjs/toolkit";
import { batch } from "react-redux";
import { FileTreeState } from "./types";

export const toggleOpen = createAction<string>("toggleOpen");

export const collapseAll = createAction("collapseAll");

export const move = createAction<{
  from: string[];
  to: string[];
}>("move");

const prepareCreateItem = (payload: { name: string; parent: string[] }) => {
  return {
    payload: {
      id: nanoid(),
      ...payload,
    },
  };
};

export const createFile = createAction("createFile", prepareCreateItem);

export const createDir = createAction("createDir", prepareCreateItem);

export const startCreateFile = createAction<string[]>("startCreateFile");

export const startCreateDir = createAction<string[]>("startCreateDir");

export const abortCreate = createAction("abortCreate");

export const deleteItem = createAction<{
  path: string[];
}>("deleteItem");

export const rename = createAction<{
  id: string;
  name: string;
}>("rename");

export const mergeTrees = createAction<Partial<FileTreeState>>("mergeTrees");

export const replaceTree = createAction<FileTreeState>("replaceTree");

export const setActive = createAction<string[]>("setActive");

export type ClickPayload = {
  path: string[];
  event: MouseEvent;
};

export const treeItemClicked = createAsyncThunk(
  "treeItemClicked",
  ({ path }: ClickPayload, { dispatch }) => {
    const id = getLast(path);
    batch(() => {
      if (id) dispatch(toggleOpen(id)); // no-op for files
      dispatch(setActive(path));
    });
  }
);
