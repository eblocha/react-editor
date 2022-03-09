import { useContextMenu } from "@/features/contextmenu";
import { AppDispatch, RootState } from "@/stores";
import { getLast } from "@/utils";
import { useCallback, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePathParts } from "../../hooks";
import {
  selectAddingFile,
  selectAddingToId,
  treeItemClicked,
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
  // We need to render the editor
  const showEditor = useSelector(
    (state: RootState) =>
      !selectAddingToId(state.fileTree, props.id)
        ? false // not adding to this dir
        : selectAddingFile(state.fileTree)
        ? state.fileTree.dirs[props.id]?.fileIds.length === 0 // adding a file - only show if no files
        : true // not adding a file - show
  );

  // Context menu
  const menuRef = useRef<HTMLDivElement>(null);
  const { menuStyle, onContextMenu, show, setShow } = useContextMenu(menuRef);
  const [, setIsRenaming] = useState(false);

  const isHighlighted = show || isActive;

  const dispatch = useDispatch<AppDispatch>();

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = useCallback(
    (e) => {
      dispatch(treeItemClicked({ path: parts, event: e.nativeEvent }));
    },
    [dispatch, parts]
  );

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
