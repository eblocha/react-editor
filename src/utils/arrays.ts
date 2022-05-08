/**
 * Determine if two arrays are identical
 * @param a The first array to compare
 * @param b The second array to compare
 * @param compareFn A function to compare elements. Default is `===`.
 * @returns Whether or not every item in the arrays are equal
 */
export const arraysEqual = <T>(
  a: T[],
  b: T[],
  compareFn: (a: T, b: T) => boolean = Object.is
) => {
  if (a.length !== b.length) return false;
  if (a.length === 0) return true;
  let i = a.length;
  while (i) {
    i--;
    const ai = a[i] as T;
    const bi = b[i] as T;
    if (!compareFn(ai, bi)) return false;
  }
  return true;
};

/**
 * Determine if an array starts with another array
 * @param a The longer array
 * @param startsWith The shorter array
 * @param compareFn A function to compare array elements
 * @returns Whether array `a` starts with array `startsWith`
 */
export const arrayStartsWith = <T>(
  a: T[],
  startsWith: T[],
  compareFn: (a: T, b: T) => boolean = Object.is
) => {
  if (startsWith.length > a.length) return false;
  return arraysEqual(a.slice(0, startsWith.length), startsWith, compareFn);
};

/**
 * Get the last item of an array
 * @param a The array
 * @returns The last item
 */
export const getLast = <T>(a: T[]): T | undefined => {
  return a[a.length - 1];
};

export const arrayFromTo = (from: number, to: number) => {
  const reversed = from > to;
  const arr = Array(Math.abs(to - from) + 1)
    .fill(0)
    .map((_, i) => i + (reversed ? to : from));
  return reversed ? arr.reverse() : arr;
};

/**
 * Move an item within an array
 * @param arr The array to mutate
 * @param from The original position in the array
 * @param to The final position in the array (based on the current state of the array)
 * @returns A reference to the mutated array
 */
export const moveItem = <T>(arr: T[], from: number, to: number): T[] => {
  // Nothing to do
  if (from == to) return arr;

  // If the destination is later in the array, subtract 1 to account for the temporarily missing item
  const dest = from < to ? to - 1 : to;
  // remove the item
  const item = arr.splice(from, 1)[0];

  if (item !== undefined) {
    // if `from` is a valid index to remove from, insert the item into its destination
    // (index is based on the original array)
    arr.splice(dest, 0, item);
  }
  return arr;
};
