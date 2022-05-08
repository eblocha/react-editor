import { TreeItems } from "../../types";
import {
  collapseAll,
  createDir,
  createFile,
  move,
  rename,
  toggleOpen,
} from "../actions";
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
      selectionData: {
        anchor1: null,
        anchor2: null,
        selected: {},
      },
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
      selectionData: {
        anchor1: null,
        anchor2: null,
        selected: {},
      },
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

describe("moving items", () => {
  it("moves a dir into its sibling", () => {
    const action1 = createDir({
      name: "root1",
      parent: [],
    });

    const action2 = createDir({
      name: "root2",
      parent: [],
    });

    const action3 = move({
      from: [action2.payload.id],
      to: [action1.payload.id],
    });

    const initial = fileTreeReducer(
      fileTreeReducer(undefined, action1),
      action2
    );
    const newState = fileTreeReducer(initial, action3);

    const expected: FileTreeState = {
      activeItem: [action1.payload.id, action2.payload.id],
      addingItem: undefined,
      dirIds: [action1.payload.id],
      fileIds: [],
      files: {},
      selectionData: {
        anchor1: null,
        anchor2: null,
        selected: {},
      },
      dirs: {
        [action1.payload.id]: {
          id: action1.payload.id,
          name: action1.payload.name,
          dirIds: [action2.payload.id],
          fileIds: [],
          // destination should be open
          isOpen: true,
          type: TreeItems.DIR,
        },
        [action2.payload.id]: {
          id: action2.payload.id,
          name: action2.payload.name,
          dirIds: [],
          fileIds: [],
          isOpen: false,
          type: TreeItems.DIR,
        },
      },
    };

    expect(newState).toStrictEqual(expected);
  });

  it("no-ops if destination is not a dir", () => {
    const action1 = createFile({
      name: "root1",
      parent: [],
    });

    const action2 = createDir({
      name: "root2",
      parent: [],
    });

    const action3 = move({
      from: [action2.payload.id],
      to: [action1.payload.id],
    });

    const initial = fileTreeReducer(
      fileTreeReducer(undefined, action1),
      action2
    );
    const newState = fileTreeReducer(initial, action3);

    expect(newState).toStrictEqual(initial);
  });

  it("no-ops if a circular reference would be created", () => {
    const action1 = createFile({
      name: "root1",
      parent: [],
    });

    const action2 = createDir({
      name: "root2",
      parent: [action1.payload.id],
    });

    const action3 = move({
      from: [action1.payload.id],
      to: [action1.payload.id, action2.payload.id],
    });

    const initial = fileTreeReducer(
      fileTreeReducer(undefined, action1),
      action2
    );
    const newState = fileTreeReducer(initial, action3);

    expect(newState).toStrictEqual(initial);
  });

  it("no-ops when trying to move root", () => {
    const action1 = createFile({
      name: "root1",
      parent: [],
    });

    const action2 = move({
      from: [],
      to: [action1.payload.id],
    });

    const initial = fileTreeReducer(undefined, action1);
    const newState = fileTreeReducer(initial, action2);

    expect(newState).toStrictEqual(initial);
  });

  it("no-ops if the source does not exist", () => {
    const action1 = createFile({
      name: "root1",
      parent: [],
    });

    const action2 = createDir({
      name: "root2",
      parent: [action1.payload.id],
    });

    const action3 = move({
      from: ["does-not-exist"],
      to: [action1.payload.id],
    });

    const initial = fileTreeReducer(
      fileTreeReducer(undefined, action1),
      action2
    );
    const newState = fileTreeReducer(initial, action3);

    expect(newState).toStrictEqual(initial);
  });

  it("no-ops if the dest does not exist", () => {
    const action1 = createFile({
      name: "root1",
      parent: [],
    });

    const action2 = createDir({
      name: "root2",
      parent: [action1.payload.id],
    });

    const action3 = move({
      from: [action1.payload.id],
      to: ["does-not-exist"],
    });

    const initial = fileTreeReducer(
      fileTreeReducer(undefined, action1),
      action2
    );
    const newState = fileTreeReducer(initial, action3);

    expect(newState).toStrictEqual(initial);
  });
});

describe("item renaming", () => {
  it("renames a file", () => {
    const action1 = createFile({
      name: "root1",
      parent: [],
    });

    const action2 = rename({
      id: action1.payload.id,
      name: "new-name",
    });

    const newState = fileTreeReducer(
      fileTreeReducer(undefined, action1),
      action2
    );

    expect(newState.files[action1.payload.id]?.name).toBe("new-name");
  });

  it("renames a dir", () => {
    const action1 = createDir({
      name: "root1",
      parent: [],
    });

    const action2 = rename({
      id: action1.payload.id,
      name: "new-name",
    });

    const newState = fileTreeReducer(
      fileTreeReducer(undefined, action1),
      action2
    );

    expect(newState.dirs[action1.payload.id]?.name).toBe("new-name");
  });

  it("no-ops if the item does not exist", () => {
    const action1 = createFile({
      name: "root1",
      parent: [],
    });

    const action2 = rename({
      id: "does-not-exist",
      name: "new-name",
    });

    const initial = fileTreeReducer(undefined, action1);

    const newState = fileTreeReducer(initial, action2);

    expect(newState).toStrictEqual(initial);
  });
});

describe("toggling open state", () => {
  it("toggles a dir open", () => {
    const action1 = createDir({
      name: "root1",
      parent: [],
    });

    const action2 = toggleOpen(action1.payload.id);

    const newState = fileTreeReducer(
      fileTreeReducer(undefined, action1),
      action2
    );

    expect(newState.dirs[action1.payload.id]?.isOpen).toBe(true);
  });

  it("no-ops when toggling a file", () => {
    const action1 = createFile({
      name: "root1",
      parent: [],
    });

    const action2 = toggleOpen(action1.payload.id);

    const initial = fileTreeReducer(undefined, action1);

    const newState = fileTreeReducer(initial, action2);

    expect(newState).toStrictEqual(initial);
  });
});

describe("collapsing", () => {
  it("collapses all dirs", () => {
    const action1 = createDir({ name: "root1", parent: [] });
    const action2 = createDir({ name: "subdir", parent: [action1.payload.id] });

    const action3 = toggleOpen(action2.payload.id);
    const action4 = collapseAll();

    const newState = fileTreeReducer(
      fileTreeReducer(
        fileTreeReducer(fileTreeReducer(undefined, action1), action2),
        action3
      ),
      action4
    );

    for (const val of Object.values(newState.dirs)) {
      expect(val.isOpen).toBe(false);
    }

    expect(newState.activeItem).toStrictEqual([action1.payload.id]);
  });
});
