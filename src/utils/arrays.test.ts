import { arrayFromTo, arraysEqual, arrayStartsWith, moveItem } from "./arrays";

describe("arraysEqual", () => {
  it("compares trivial arrays", () => {
    expect(arraysEqual([0, 1, 2], [0, 1, 2])).toBe(true);
    expect(arraysEqual(["a", "b", "c"], ["a", "b", "c"])).toBe(true);
    expect(arraysEqual(["a", "b", "c"], ["a", "b", "d"])).toBe(false);

    expect(arraysEqual(["a", "b", "c"], ["a", "b"])).toBe(false);

    expect(arraysEqual([0, 1], [1, 2])).toBe(false);
    expect(arraysEqual([0, 1, 2], [1, 2])).toBe(false);
  });

  it("compares empty arrays", () => {
    expect(arraysEqual([], [])).toBe(true);
    const alwaysFalse = () => false;
    expect(arraysEqual([], [], alwaysFalse)).toBe(true);
  });

  it("uses the compare function", () => {
    const compareFn = jest.fn(() => true);

    expect(arraysEqual([0, 1, 2], [0, 1, 2], compareFn)).toBe(true);
    expect(compareFn).toBeCalledTimes(3);

    const alwaysFalse = () => false;
    expect(arraysEqual([0, 1, 2], [0, 1, 2], alwaysFalse)).toBe(false);
  });
});

describe("arrayStartsWith", () => {
  it("finds whether an array starts with another", () => {
    expect(arrayStartsWith(["a", "b"], ["a"])).toBe(true);
    expect(arrayStartsWith(["a", "b"], ["b"])).toBe(false);

    expect(arrayStartsWith(["a", "b"], [])).toBe(true);

    expect(arrayStartsWith([], ["a"])).toBe(false);
    expect(arrayStartsWith([], [])).toBe(true);
  });
});

describe("arrayFromTo", () => {
  it("creates an array from 0", () => {
    expect(arrayFromTo(0, 2)).toStrictEqual([0, 1, 2]);
  });

  it("creates an array from non-0", () => {
    expect(arrayFromTo(5, 8)).toStrictEqual([5, 6, 7, 8]);
  });

  it("creates an array going backwards", () => {
    expect(arrayFromTo(8, 5)).toStrictEqual([8, 7, 6, 5]);
    expect(arrayFromTo(0, -2)).toStrictEqual([0, -1, -2]);
  });
});

describe("moveItem", () => {
  it("moves an item to the start", () => {
    expect(moveItem([0, 1, 2], 2, 0)).toStrictEqual([2, 0, 1]);
  });

  it("moves an item to the end", () => {
    expect(moveItem([0, 1, 2], 0, 2)).toStrictEqual([1, 2, 0]);
  });

  it("moves an item forward", () => {
    expect(moveItem([0, 1, 2, 3], 1, 2)).toStrictEqual([0, 2, 1, 3]);
  });

  it("moves an item backwards", () => {
    expect(moveItem([0, 1, 2, 3], 2, 1)).toStrictEqual([0, 2, 1, 3]);
  });

  it("no-ops if src==dest", () => {
    expect(moveItem([0, 1, 2, 3], 2, 2)).toStrictEqual([0, 1, 2, 3]);
  });
});
