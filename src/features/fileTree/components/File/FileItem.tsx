import { useContextMenu } from "@/features/contextmenu";
import { AppDispatch, RootState } from "@/stores";
import { getLast } from "@/utils";
import { useCallback, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePathParts } from "../../hooks";
import {
  rename,
  selectAddingFile,
  selectIsFirstFile,
  treeItemClicked,
} from "../../store";
import { File } from "../../types";
import { AddItem } from "../AddItem";
import { Editor } from "../Editor";
import { FileComponent } from "./FileComponent";
import { FileContextMenu } from "./FileContextMenu";

type IProps = File & {
  path: string;
  namePath: string;
  index: number;
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

  // Context menu
  const menuRef = useRef<HTMLDivElement>(null);
  const { menuStyle, onContextMenu, show, setShow } = useContextMenu(menuRef);
  const [isRenaming, setIsRenaming] = useState(false);

  const isHighlighted = show || isActive;

  const dispatch = useDispatch<AppDispatch>();

  const handleClick: React.MouseEventHandler<HTMLButtonElement> = useCallback(
    (e) => {
      dispatch(
        treeItemClicked({
          path: parts,
          event: e.nativeEvent,
          index: props.index,
        })
      );
    },
    [dispatch, parts, props.index]
  );

  const handleRename = useCallback(
    (name: string) => {
      dispatch(rename({ id: props.id, name }));
      setIsRenaming(false);
    },
    [dispatch, props.id]
  );

  const handleAbort = useCallback(() => {
    setIsRenaming(false);
  }, []);

  return (
    <>
      {showEditor && <AddItem />}
      <li className="w-full overflow-hidden">
        <FileComponent
          depth={parts.length - 1}
          title={props.namePath}
          onClick={handleClick}
          onContextMenu={onContextMenu}
          className={isHighlighted ? "bg-gray-200" : undefined}
        >
          {isRenaming ? (
            <Editor
              onAbort={handleAbort}
              onSubmit={handleRename}
              initialName={props.name}
            />
          ) : (
            props.name
          )}
        </FileComponent>
      </li>

      {/* Context Menu */}
      {show && (
        <FileContextMenu
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
