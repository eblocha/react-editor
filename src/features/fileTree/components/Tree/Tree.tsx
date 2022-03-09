import { RootState } from "@/stores";
import { useSelector } from "react-redux";
import {
  compareTreeProps,
  makeSelectTreeListProps,
  selectAddingFile,
  selectAddingToId,
} from "../../store";
import { AddItem } from "../AddItem";
import { TreeItemComponent } from "../TreeItem";
import { FillArea } from "./FillArea";

const selector = makeSelectTreeListProps();

export const Tree = () => {
  const { ids, namePaths, paths } = useSelector(
    (state: RootState) => selector(state.fileTree),
    compareTreeProps
  );

  // Adding a dir to root
  const isAddingDir = useSelector(
    (state: RootState) =>
      selectAddingToId(state.fileTree) && !selectAddingFile(state.fileTree)
  );

  // Adding a file to root and there are no files yet
  const isAddingFileAndNoFiles = useSelector(
    (state: RootState) =>
      selectAddingToId(state.fileTree) &&
      selectAddingFile(state.fileTree) &&
      state.fileTree.fileIds.length === 0
  );

  return (
    <ul className="h-full w-full overflow-x-hidden overflow-y-auto flex flex-col">
      {/* Dirs */}
      {isAddingDir && <AddItem />}
      {ids.map((id, index) => (
        <TreeItemComponent
          id={id}
          path={paths[index] as string}
          namePath={namePaths[index] as string}
          key={id}
        />
      ))}
      {isAddingFileAndNoFiles && <AddItem />}

      {/* Free space */}
      <li
        className="grow"
        style={{
          minHeight: "2rem",
        }}
      >
        <FillArea />
      </li>
    </ul>
  );
};
