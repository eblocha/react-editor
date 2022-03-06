import { Directory, File, TreeItems } from "../types";

export type FileTreeState = {
  root: string[];
  items: Record<string, Directory | File>;
  activeItem: string[];
  addingItem?: {
    path: string[];
    type: TreeItems;
  };
};
