import { useMemo } from "react";
import { splitPath } from "../utils";

export const usePathParts = (path: string) => {
  return useMemo(() => splitPath(path), [path]);
};
