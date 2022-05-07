import { SelectionData } from "@/utils";
import { Directory, File, TreeItems } from "../types";

export type FileTreeState = {
  dirIds: string[];
  fileIds: string[];
  dirs: Record<string, Directory>;
  files: Record<string, File>;
  selectionData: SelectionData;
  activeItem: string[];
  addingItem?: {
    path: string[];
    type: TreeItems;
  };
};
