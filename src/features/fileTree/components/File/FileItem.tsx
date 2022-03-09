import { AppDispatch, RootState } from "@/stores";
import { getLast } from "@/utils";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePathParts } from "../../hooks";
import {
  selectAddingFile,
  selectIsFirstFile,
  treeItemClicked,
} from "../../store";
import { File } from "../../types";
import { AddItem } from "../AddItem";
import { FileComponent } from "./FileComponent";

type IProps = File & {
  path: string;
  namePath: string;
};

export const FileItem = (props: IProps) => {
  const parts = usePathParts(props.path);
  const isActive = useSelector(
    (state: RootState) => getLast(state.fileTree.activeItem) === props.id
  );

  // We are adding an item to the parent dir, and this is the first file item - render the editor
  const showEditor = useSelector((state: RootState) => {
    const addingFile = selectAddingFile(state.fileTree);
    if (!addingFile) return false;

    const path = state.fileTree.addingItem?.path;
    return path
      ? selectIsFirstFile(state.fileTree, props.id, getLast(path))
      : false;
  });

  const dispatch = useDispatch<AppDispatch>();

  const handleClick = useCallback(() => {
    dispatch(treeItemClicked(parts));
  }, [dispatch, parts]);

  return (
    <>
      {showEditor && <AddItem />}
      <li className="w-full overflow-hidden">
        <FileComponent
          depth={parts.length - 1}
          title={props.namePath}
          onClick={handleClick}
          className={isActive ? "bg-gray-200" : undefined}
        >
          {props.name}
        </FileComponent>
      </li>
    </>
  );
};
