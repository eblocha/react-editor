import { RootState } from "@/stores";
import { useSelector } from "react-redux";
import { useDirIds, useFileIds } from "../../hooks";
import { selectAddingFile, selectAddingToId } from "../../store";
import { AddItem } from "../AddItem";
import { TreeItemComponent } from "../TreeItem";
import { FillArea } from "./FillArea";

export const Tree = () => {
  const dirIds = useDirIds();
  const fileIds = useFileIds();

  const isAdding = useSelector((state: RootState) =>
    selectAddingToId(state.fileTree)
  );
  const addingFile = useSelector((state: RootState) =>
    selectAddingFile(state.fileTree)
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
