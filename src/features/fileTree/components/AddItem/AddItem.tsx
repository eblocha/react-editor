import { RootState } from "@/stores";
import { useSelector } from "react-redux";
import { TreeItems } from "../../types";
import { AddDir } from "./AddDir";
import { AddFile } from "./AddFile";

export const AddItem = () => {
  const type = useSelector(
    (state: RootState) => state.fileTree.addingItem?.type
  );
  const path = useSelector(
    (state: RootState) => state.fileTree.addingItem?.path
  );

  if (!path || type === undefined) return null;

  switch (type) {
    case TreeItems.DIR:
      return <AddDir path={path} />;
    case TreeItems.FILE:
      return <AddFile path={path} />;
  }
};
