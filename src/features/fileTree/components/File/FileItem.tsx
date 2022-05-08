import { RootState } from "@/stores";
import { getLast } from "@/utils";
import { useSelector } from "react-redux";
import { useTreeItemProps } from "../../hooks";
import { selectAddingFile, selectIsFirstFile } from "../../store";
import { File } from "../../types";
import { AddItem } from "../AddItem";
import { Overlay } from "../Overlay";
import { FileComponent } from "./FileComponent";
import { FileContextMenu } from "./FileContextMenu";

type IProps = File & {
  path: string;
  namePath: string;
  index: number;
};

export const FileItem = (props: IProps) => {
  // We are adding an item to the parent dir, and this is the first file item - render the editor
  const showEditor = useSelector((state: RootState) => {
    const addingFile = selectAddingFile(state.fileTree);
    if (!addingFile) return false;

    const path = state.fileTree.addingItem?.path;
    return path
      ? selectIsFirstFile(state.fileTree, props.id, getLast(path))
      : false;
  });

  const {
    innerNode,
    handleClick,
    className,
    // --- context menu ---
    isRenaming,
    setIsRenaming,
    setShow,
    menuRef,
    showMenu,
    onContextMenu,
    menuStyle,
    parts,
  } = useTreeItemProps(props);

  return (
    <>
      {isRenaming && <Overlay />}
      {showEditor && <AddItem />}
      <li
        className={`w-full overflow-hidden${
          isRenaming ? " bg-white z-10" : ""
        }`}
      >
        <FileComponent
          depth={parts.length - 1}
          title={props.namePath}
          onClick={handleClick}
          onContextMenu={onContextMenu}
          className={className}
        >
          {innerNode}
        </FileComponent>
      </li>

      {/* Context Menu */}
      {showMenu && (
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
