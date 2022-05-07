import { arrayFromTo } from "./arrays";

const EMPTY = {};

export type Selected = Record<number, null>;

export type SelectionData = {
  anchor1: number | null;
  anchor2: number | null;
  selected: Selected;
};

export type SelectionEvent = {
  shiftKey: boolean;
  ctrlKey: boolean;
};

/**
 * Update selection data to respond to a mouse event. Mutates `selectionData`.
 * @param selectionData The data to mutate
 * @param e The selection event (mouse event)
 * @param index The list item index clicked
 * @returns A reference to the mutated selection data
 */
export const updateSelectionData = (
  selectionData: SelectionData,
  e: SelectionEvent,
  index: number
) => {
  if (!e.shiftKey || selectionData.anchor1 === null) {
    selectionData.anchor1 = index;
    selectionData.anchor2 = null;
    if (e.ctrlKey && index in selectionData.selected) {
      delete selectionData.selected[index];
    } else if (e.ctrlKey) {
      selectionData.selected[index] = null;
    } else {
      selectionData.selected = {
        [index]: null,
      };
    }
  } else {
    if (selectionData.anchor2 !== null) {
      arrayFromTo(selectionData.anchor1, selectionData.anchor2).forEach(
        (idx) => delete selectionData.selected[idx]
      );
    }

    arrayFromTo(selectionData.anchor1, index).forEach((idx) => {
      selectionData.selected[idx] = null;
    });

    selectionData.anchor2 = index;
  }

  return selectionData;
};

/**
 * Initialize selection data
 * @param initial Initial selected indices
 * @returns Freshly initialized selection data
 */
export const createDefaultSelectionData = (
  initial?: Selected
): SelectionData => ({
  anchor1: null,
  anchor2: null,
  selected: initial ?? EMPTY,
});

/**
 * Reset list selection data. Mutates state.
 * @param current The current list selection state
 * @returns A reference to the mutated state
 */
export const resetSelectionData = (current: SelectionData) => {
  current.anchor1 = null;
  current.anchor2 = null;
  current.selected = EMPTY;
  return current;
};
