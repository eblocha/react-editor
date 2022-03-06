import { arraysEqual, arrayStartsWith } from "@/utils";

/**
 * Determine if an item can move to a destination, preventing circular references
 * @param src The item to be moved
 * @param dest The destination dir
 * @returns Whether or not moving `src` to `dir` would create a circular reference
 */
export const itemCanMove = (src: string[], dest: string[]) => {
  return !arraysEqual(src.slice(0, -1), dest) && !arrayStartsWith(dest, src);
};

/**
 * Split a fully-resolved path into its components
 * @param path The path to split into components
 * @returns The path parts
 */
export const splitPath = (path: string): string[] => {
  const sep = "/";
  if (path === sep) return [];

  const split = path.split(sep);
  // remove empty string at start
  return split.slice(1);
};

/**
 * Append an item to a path
 * @param base The base path to append to
 * @param item The item to append
 * @returns The new path
 */
export const appendPath = (base = "", item: string) => {
  return base + "/" + item;
};
