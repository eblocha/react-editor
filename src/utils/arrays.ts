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
  let i = a.length;
  while (i--) {
    const ai = a[i];
    const bi = b[i];
    if (!ai || !bi) return false;
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
