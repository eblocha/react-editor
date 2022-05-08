import { selectTreeListProps, TreeListProps } from "../selectors";
import { FileTreeState } from "../types";
import { TreeItems } from "../../types";

describe("tree list compilation", () => {
  it("renders a list of tree items", () => {
    /**
     * - root-dir1
     *   | - sub-dir1-1
     *   | + sub-dir1-2
     *   \ file1-1
     * + root-dir2
     *   | + sub-dir2-1
     *   |   \ file2-1-1
     *   | - sub-dir2-2
     *   \ file2-1
     * root-file1
     */

    type ItemSpec = {
      id: string;
      name: string;
    };

    // Dir 1
    const rootDir1: ItemSpec = {
      id: "rd1",
      name: "rootDir1",
    };

    const subDir11: ItemSpec = {
      id: "sd11",
      name: "subDir11",
    };

    const subDir12: ItemSpec = {
      id: "sd12",
      name: "subDir12",
    };

    const file11: ItemSpec = {
      id: "f11",
      name: "file11",
    };

    // Dir 2
    const rootDir2: ItemSpec = {
      id: "rd2",
      name: "rootDir2",
    };

    const subDir21: ItemSpec = {
      id: "sd21",
      name: "subDir21",
    };

    const file211: ItemSpec = {
      id: "f211",
      name: "file211",
    };

    const subDir22: ItemSpec = {
      id: "sd22",
      name: "subDir22",
    };

    const file21: ItemSpec = {
      id: "f21",
      name: "file21",
    };

    // Root file
    const file1: ItemSpec = {
      id: "f1",
      name: "file1",
    };

    const state: FileTreeState = {
      activeItem: [],
      dirIds: [rootDir1.id, rootDir2.id, "doesnt-exist"],
      dirs: {
        [rootDir1.id]: {
          ...rootDir1,
          dirIds: [subDir11.id, subDir12.id],
          fileIds: [file11.id],
          isOpen: false,
          type: TreeItems.DIR,
        },
        [subDir11.id]: {
          ...subDir11,
          dirIds: [],
          fileIds: [],
          isOpen: false,
          type: TreeItems.DIR,
        },
        [subDir12.id]: {
          ...subDir12,
          dirIds: [],
          fileIds: [],
          isOpen: true,
          type: TreeItems.DIR,
        },
        [rootDir2.id]: {
          ...rootDir2,
          dirIds: [subDir21.id, subDir22.id],
          fileIds: [file21.id],
          isOpen: true,
          type: TreeItems.DIR,
        },
        [subDir21.id]: {
          ...subDir21,
          dirIds: [],
          fileIds: [file211.id],
          isOpen: true,
          type: TreeItems.DIR,
        },
        [subDir22.id]: {
          ...subDir22,
          dirIds: [],
          fileIds: [],
          isOpen: false,
          type: TreeItems.DIR,
        },
      },
      fileIds: [file1.id, "doesnt-exist"],
      files: {
        [file1.id]: {
          ...file1,
          type: TreeItems.FILE,
        },
        [file11.id]: {
          ...file11,
          type: TreeItems.FILE,
        },
        [file211.id]: {
          ...file211,
          type: TreeItems.FILE,
        },
        [file21.id]: {
          ...file21,
          type: TreeItems.FILE,
        },
      },
      selectionData: {
        anchor1: null,
        anchor2: null,
        selected: {},
      },
    };

    const selected = selectTreeListProps(state);

    const expected: TreeListProps = {
      ids: [
        rootDir1.id,
        rootDir2.id,
        subDir21.id,
        file211.id,
        subDir22.id,
        file21.id,
        file1.id,
      ],
      namePaths: [
        "/" + rootDir1.name,
        "/" + rootDir2.name,
        "/" + [rootDir2.name, subDir21.name].join("/"),
        "/" + [rootDir2.name, subDir21.name, file211.name].join("/"),
        "/" + [rootDir2.name, subDir22.name].join("/"),
        "/" + [rootDir2.name, file21.name].join("/"),
        "/" + file1.name,
      ],
      paths: [
        "/" + rootDir1.id,
        "/" + rootDir2.id,
        "/" + [rootDir2.id, subDir21.id].join("/"),
        "/" + [rootDir2.id, subDir21.id, file211.id].join("/"),
        "/" + [rootDir2.id, subDir22.id].join("/"),
        "/" + [rootDir2.id, file21.id].join("/"),
        "/" + file1.id,
      ],
    };

    expect(selected).toStrictEqual(expected);
  });
});
