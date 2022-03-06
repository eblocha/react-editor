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

type HasParent = {
  parent: string;
  item: string;
};

type RootItem = {
  parent: undefined;
  item: string;
};

type NoItem = {
  parent: undefined;
  item: undefined;
};

/**
 * Get the parent and item ids from a path
 * @param path The path of the item
 */
export const getParentAndItem = (
  path: string[]
): HasParent | RootItem | NoItem => {
  const parentIdSlice = path.slice(-2);

  if (parentIdSlice.length === 0) {
    return {
      parent: undefined,
      item: undefined,
    };
  } else if (parentIdSlice.length === 1) {
    return {
      parent: undefined,
      item: parentIdSlice[0],
    };
  } else {
    return {
      parent: parentIdSlice[0] as string,
      item: parentIdSlice[1] as string,
    };
  }
};

export type NameValidationResult = {
  status: "ok" | "warn" | "error";
  messages: string[];
};

/**
 * Validate a dir or file name
 * @param name The name to validate
 */
export const validateName = (name: string): NameValidationResult => {
  let status: "ok" | "warn" | "error" = "ok";
  const messages = [];

  const whitespaceRule = /(^\s+|\s+$)/;
  if (whitespaceRule.test(name)) {
    status = "warn";
    messages.push("Leading or trailing whitespace");
  }

  const forbiddenChars = /\//;

  if (forbiddenChars.test(name)) {
    status = "error";
    messages.push("Forbidden characters: /");
  }

  return {
    status,
    messages,
  };
};
