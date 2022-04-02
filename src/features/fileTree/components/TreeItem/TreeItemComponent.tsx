import { useSelector } from "react-redux";
import { selectItem } from "../../store";
import { TreeItems } from "../../types";
import { DirectoryItem } from "../Directory";
import { FileItem } from "../File";
import { RootState } from "@/stores";

export const TreeItemComponent = (props: {
  id: string;
  path: string;
  namePath: string;
  index: number;
}) => {
  const item = useSelector((state: RootState) =>
    selectItem(state.fileTree, props.id)
  );

  if (!item) return null;

  switch (item?.type) {
    case TreeItems.DIR:
      return (
        <DirectoryItem
          {...item}
          path={props.path}
          namePath={props.namePath}
          index={props.index}
        />
      );
    case TreeItems.FILE:
      return (
        <FileItem
          {...item}
          path={props.path}
          namePath={props.namePath}
          index={props.index}
        />
      );
    default:
      return null;
  }
};
