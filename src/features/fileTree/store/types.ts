import { Directory, File, TreeItems } from "../types";

export type FileTreeState = {
  dirIds: string[];
  fileIds: string[];
  dirs: Record<string, Directory>;
  files: Record<string, File>;
  activeItem: string[];
  addingItem?: {
    path: string[];
    type: TreeItems;
  };
};
