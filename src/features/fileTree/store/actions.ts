import { openFile } from "@/features/editor";
import { RootState } from "@/stores";
import { getLast, SelectionEvent } from "@/utils";
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

export const clickListItem = createAction<{
  event: SelectionEvent;
  index: number;
}>("clickListItem");

export const resetListData = createAction("resetListData");

export type ClickPayload = {
  index: number;
  path: string[];
  event: MouseEvent;
};

export const treeItemClicked = createAsyncThunk<
  void,
  ClickPayload,
  { state: RootState }
>(
  "treeItemClicked",
  ({ path, index, event }: ClickPayload, { dispatch, getState }) => {
    const id = getLast(path);
    const { fileTree: state } = getState();
    batch(() => {
      const modifierUsed = event.ctrlKey || event.shiftKey;
      if (id) {
        if (!modifierUsed) {
          if (!state.files[id]) {
            dispatch(toggleOpen(id));
          } else {
            dispatch(openFile({ id }));
          }
        }
        dispatch(
          clickListItem({
            index,
            event: {
              ctrlKey: event.ctrlKey,
              shiftKey: event.shiftKey,
            },
          })
        );
      } else {
        dispatch(resetListData());
      }
      dispatch(setActive(path));
    });
  }
);
