import { arraysEqual, arrayStartsWith } from "./arrays";

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
