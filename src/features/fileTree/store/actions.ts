import { PayloadAction } from "@reduxjs/toolkit";
import { FileTreeState } from "./types";

export type OpenAction = PayloadAction<string>;

export type MoveAction = PayloadAction<{
  from: string[];
  to: string[];
}>;

export type CreateFileAction = PayloadAction<{
  parent?: string;
  name: string;
  id: string;
}>;

export type CreateDirAction = PayloadAction<{
  parent?: string;
  name: string;
  id: string;
}>;

export type DeleteAction = PayloadAction<{
  path: string[];
}>;

export type RenameAction = PayloadAction<{
  name: string;
  id: string;
}>;

export type MergeTreesAction = PayloadAction<Partial<FileTreeState>>;

export type ReplaceTreeAction = PayloadAction<FileTreeState>;
