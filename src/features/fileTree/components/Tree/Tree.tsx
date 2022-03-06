import { RootState } from "@/stores";
import { useSelector } from "react-redux";
import { useDirIds, useFileIds } from "../../hooks";
import { TreeItems } from "../../types";
import { AddItem } from "../AddItem";
import { TreeItemComponent } from "../TreeItem";
import { FillArea } from "./FillArea";

export const Tree = () => {
  const dirIds = useDirIds();
  const fileIds = useFileIds();

  const isAdding = useSelector(
    (state: RootState) => state.fileTree.addingItem?.path.length === 0
  );
  const addingFile = useSelector(
    (state: RootState) => state.fileTree.addingItem?.type === TreeItems.FILE
  );

  return (
    <ul className="h-full w-full overflow-x-hidden overflow-y-auto flex flex-col">
      {/* Dirs */}
      {isAdding && !addingFile && <AddItem />}
      {dirIds.map((id) => (
        <TreeItemComponent id={id} parentPath="" parentNamePath="" key={id} />
      ))}

      {/* Files */}
      {isAdding && addingFile && <AddItem />}
      {fileIds.map((id) => (
        <TreeItemComponent id={id} parentPath="" parentNamePath="" key={id} />
      ))}

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
