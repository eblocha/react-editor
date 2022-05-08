import { editorReducer, initialState } from "../reducer";
import { openFile } from "../actions";
import { EditorState } from "../types";

it("Initializes default state", () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore - empty action is allowed for init
  expect(editorReducer(undefined, {})).toStrictEqual(initialState);
});

describe("opening tabs", () => {
  it("opens a new tab", () => {
    const id = "test-id";
    const action = openFile({ id });

    const expected: EditorState = {
      files: {
        [id]: {
          id,
          content: "",
          isDeleted: false,
          unsavedContent: null,
        },
      },
      tabs: {
        active: id,
        history: [id],
        open: [id],
      },
    };

    expect(editorReducer(undefined, action)).toStrictEqual(expected);
  });

  it("opens a new tab at the index specified", () => {
    const id0 = "existing-file";
    const id = "test-id";

    const action = openFile({ id, index: 0 });

    const initial: EditorState = {
      files: {
        [id0]: {
          id: id0,
          content: "",
          isDeleted: false,
          unsavedContent: null,
        },
      },
      tabs: {
        active: id0,
        history: [id0],
        open: [id0],
      },
    };

    const expected: EditorState = {
      files: {
        [id0]: {
          id: id0,
          content: "",
          isDeleted: false,
          unsavedContent: null,
        },
        [id]: {
          id: id,
          content: "",
          isDeleted: false,
          unsavedContent: null,
        },
      },
      tabs: {
        active: id,
        history: [id0, id],
        open: [id, id0],
      },
    };

    expect(editorReducer(initial, action)).toStrictEqual(expected);
  });
});
