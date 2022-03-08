import { useContextMenu } from "@/features/contextmenu";
import { AppDispatch, RootState } from "@/stores";
import { getLast } from "@/utils";
import { useCallback, useRef, useState } from "react";
import { useDispatch, batch, useSelector } from "react-redux";
import { usePathParts } from "../../hooks";
import {
  toggleOpen,
  setActive,
  selectAddingFile,
  selectAddingToId,
} from "../../store";
import { Directory } from "../../types";
import { AddItem } from "../AddItem";
import { DirectoryComponent } from "./DirectoryComponent";
import { DirectoryContextMenu } from "./DirectoryContextMenu";

type IProps = Directory & {
  path: string;
  namePath: string;
};

export const DirectoryItem = (props: IProps) => {
  const parts = usePathParts(props.path);
  const isActive = useSelector(
    (state: RootState) => getLast(state.fileTree.activeItem) === props.id
  );
  // We are adding a file and there are no files yet
  const isAddingFileAndNoFiles = useSelector(
    (state: RootState) =>
      selectAddingToId(state.fileTree, props.id) &&
      selectAddingFile(state.fileTree) &&
      state.fileTree.dirs[props.id]?.fileIds.length === 0
  );
  // We need to render the editor
  const showEditor = useSelector(
    (state: RootState) =>
      isAddingFileAndNoFiles ||
      (selectAddingToId(state.fileTree, props.id) &&
        !selectAddingFile(state.fileTree))
  );

  // Context menu
  const menuRef = useRef<HTMLDivElement>(null);
  const { menuStyle, onContextMenu, show, setShow } = useContextMenu(menuRef);
  const [, setIsRenaming] = useState(false);

  const isHighlighted = show || isActive;

  const dispatch = useDispatch<AppDispatch>();

  const handleClick = useCallback(() => {
    batch(() => {
      dispatch(toggleOpen(props.id));
      dispatch(setActive(parts));
    });
  }, [dispatch, parts, props.id]);

  return (
    <>
      <li className="w-full overflow-hidden">
        <DirectoryComponent
          depth={parts.length - 1}
          isOpen={props.isOpen}
          onClick={handleClick}
          title={props.namePath}
          className={isHighlighted ? "bg-gray-200" : undefined}
          onContextMenu={onContextMenu}
        >
          {props.name}
        </DirectoryComponent>
      </li>

      {/* Dirs */}
      {showEditor && <AddItem />}

      {/* Context Menu */}
      {show && (
        <DirectoryContextMenu
          id={props.id}
          path={parts}
          namePath={props.namePath}
          menuStyle={menuStyle}
          setIsRenaming={setIsRenaming}
          setShow={setShow}
          ref={menuRef}
        />
      )}
    </>
  );
};
