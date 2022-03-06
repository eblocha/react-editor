import { TreeItems } from "../../types";
import { createDir, createFile } from "../actions";
import { fileTreeReducer, initialState } from "../reducer";
import { FileTreeState } from "../types";

it("Initializes default state", () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore - empty action is allowed for init
  expect(fileTreeReducer(undefined, {})).toStrictEqual(initialState);
});

describe("Adding files", () => {
  it("Adds a file to the root dir", () => {
    const action = createFile({
      name: "Test File",
      parent: [],
    });

    const expected: FileTreeState = {
      // New item will be active when created
      activeItem: [action.payload.id],
      files: {
        [action.payload.id]: {
          id: action.payload.id,
          name: "Test File",
          type: TreeItems.FILE,
        },
      },
      dirs: {},
      // Added to root ids
      fileIds: [action.payload.id],
      dirIds: [],
      addingItem: undefined,
    };

    expect(fileTreeReducer(undefined, action)).toStrictEqual(expected);
  });

  it("Adds a file to a top-level dir", () => {
    const action1 = createDir({
      name: "test",
      parent: [],
    });

    const initial = fileTreeReducer(undefined, action1);

    const action2 = createFile({
      name: "test",
      parent: [action1.payload.id],
    });

    const newState = fileTreeReducer(initial, action2);

    const dir = newState.dirs[action1.payload.id];

    // Dir is opened
    expect(dir?.isOpen).toBe(true);
    // Item is added
    expect(dir?.fileIds).toContain(action2.payload.id);
    expect(newState.files[action2.payload.id]).toBeDefined();
    // Does not add to root
    expect(newState.fileIds).not.toContain(action2.payload.id);
    // Sets new file active
    expect(newState.activeItem).toStrictEqual([
      action1.payload.id,
      action2.payload.id,
    ]);
  });

  it("Adds a file to a nested dir", () => {
    const action1 = createDir({
      name: "test",
      parent: [],
    });
    const action2 = createDir({
      name: "test",
      parent: [action1.payload.id],
    });
    const action3 = createFile({
      name: "test",
      parent: [action1.payload.id, action2.payload.id],
    });

    const initial = fileTreeReducer(
      fileTreeReducer(undefined, action1),
      action2
    );
    const newState = fileTreeReducer(initial, action3);

    const dir1 = newState.dirs[action1.payload.id];
    const dir2 = newState.dirs[action2.payload.id];

    // Dir is opened
    expect(dir1?.isOpen).toBe(true);
    expect(dir2?.isOpen).toBe(true);

    // Added to correct dir
    expect(dir1?.fileIds).not.toContain(action3.payload.id);
    expect(dir2?.fileIds).toContain(action3.payload.id);
    expect(newState.fileIds).not.toContain(action3.payload.id);
    expect(newState.files[action3.payload.id]).toBeDefined();

    // Activated
    expect(newState.activeItem).toStrictEqual([
      action1.payload.id,
      action2.payload.id,
      action3.payload.id,
    ]);
  });
});

describe("Adding dirs", () => {
  it("Adds a dir to root", () => {
    const action = createDir({
      name: "test",
      parent: [],
    });

    const expected: FileTreeState = {
      // New item will be active when created
      activeItem: [action.payload.id],
      dirs: {
        [action.payload.id]: {
          type: TreeItems.DIR,
          id: action.payload.id,
          name: "test",
          isOpen: false,
          dirIds: [],
          fileIds: [],
        },
      },
      files: {},
      // Added to root ids
      dirIds: [action.payload.id],
      fileIds: [],
      addingItem: undefined,
    };

    expect(fileTreeReducer(undefined, action)).toStrictEqual(expected);
  });

  it("Adds to an existing dir", () => {
    const action1 = createDir({
      name: "test",
      parent: [],
    });

    const action2 = createDir({
      name: "test",
      parent: [action1.payload.id],
    });

    const initial = fileTreeReducer(undefined, action1);

    const newState = fileTreeReducer(initial, action2);

    const dir = newState.dirs[action1.payload.id];

    // Does not add to root
    expect(newState.dirIds).not.toContain(action2.payload.id);
    expect(dir?.dirIds).toContain(action2.payload.id);
    expect(newState.dirs[action2.payload.id]).toBeDefined();

    // Opens parent
    expect(dir?.isOpen).toBe(true);

    // Sets active
    expect(newState.activeItem).toStrictEqual([
      action1.payload.id,
      action2.payload.id,
    ]);
  });
});
