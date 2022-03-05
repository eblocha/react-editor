import { Directory, File } from "../types";

export type FileTreeState = {
  root: string[];
  items: Record<string, Directory | File>;
};
