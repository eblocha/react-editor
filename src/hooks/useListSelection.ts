import { arrayFromTo } from "@/utils";
import React, { useCallback, useState } from "react";

export type ListSelectionData = {
  anchor1: number | null;
  anchor2: number | null;
  selected: Set<number>;
};

export type ListSelectionValue = ListSelectionData & {
  onClick: (e: React.MouseEvent, index: number | null) => void;
  reset: () => void;
  setValue: React.Dispatch<React.SetStateAction<ListSelectionData>>;
};

export const defaultValue: ListSelectionData = {
  anchor1: null,
  anchor2: null,
  selected: new Set(),
};

export const createDefaultValue = (
  initial?: Set<number>
): ListSelectionData => ({
  anchor1: null,
  anchor2: null,
  selected: initial ?? new Set(),
});

export const useListSelection = (
  initialSelection?: Set<number>
): ListSelectionValue => {
  const [value, setValue] = useState(createDefaultValue(initialSelection));

  const reset = useCallback(() => {
    setValue(createDefaultValue());
  }, []);

  const onClick = useCallback((e: React.MouseEvent, index: number | null) => {
    e.stopPropagation();

    if (index === null) {
      reset();
      return;
    }

    setValue((value) => {
      let newValue = { ...value, selected: new Set(value.selected) };

      if (!e.shiftKey || newValue.anchor1 === null) {
        newValue.anchor1 = index;
        newValue.anchor2 = null;
        if (e.ctrlKey && newValue.selected.has(index)) {
          newValue.selected.delete(index);
        } else if (e.ctrlKey) {
          newValue.selected.add(index);
        } else {
          newValue.selected = new Set([index]);
        }
      } else {
        if (newValue.anchor2 !== null) {
          arrayFromTo(newValue.anchor1, newValue.anchor2).forEach(
            newValue.selected.delete,
            newValue.selected
          );
        }

        arrayFromTo(newValue.anchor1, index).forEach(
          newValue.selected.add,
          newValue.selected
        );

        newValue.anchor2 = index;
      }

      return newValue;
    });
  }, []);

  return { ...value, onClick, reset, setValue };
};
