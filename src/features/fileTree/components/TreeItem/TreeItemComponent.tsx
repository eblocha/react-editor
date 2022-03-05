import { useSelector } from "react-redux";
import { selectItem } from "../../store";
import { TreeItems } from "../../types";
import { appendPath } from "../../utils";
import { DirectoryItem } from "../Directory";
import { FileItem } from "../File";
import { RootState } from "@/stores";

export const TreeItemComponent = (props: {
  id: string;
  parentPath: string;
  parentNamePath: string;
}) => {
  const item = useSelector((state: RootState) =>
    selectItem(state.fileTree, props.id)
  );

  if (!item) return null;

  const path = appendPath(props.parentPath, item.id);
  const namePath = appendPath(props.parentNamePath, item.name);

  switch (item?.type) {
    case TreeItems.DIR:
      return <DirectoryItem {...item} path={path} namePath={namePath} />;
    case TreeItems.FILE:
      return <FileItem {...item} path={path} namePath={namePath} />;
    default:
      return null;
  }
};
