export enum TreeItems {
  DIR,
  FILE,
}

export type Directory = {
  type: TreeItems.DIR;
  id: string;
  name: string;
  dirIds: string[];
  fileIds: string[];
  isOpen: boolean;
};

export type File = {
  type: TreeItems.FILE;
  id: string;
  name: string;
};

export type TreeItem = Directory | File;
