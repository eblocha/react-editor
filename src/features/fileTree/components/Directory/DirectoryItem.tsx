import { RootState } from "@/stores";
import { useSelector } from "react-redux";
import { useTreeItemProps } from "../../hooks";
import { selectAddingFile, selectAddingToId } from "../../store";
import { Directory } from "../../types";
import { AddItem } from "../AddItem";
import { DirectoryComponent } from "./DirectoryComponent";
import { DirectoryContextMenu } from "./DirectoryContextMenu";

type IProps = Directory & {
  path: string;
  namePath: string;
  index: number;
};

export const DirectoryItem = (props: IProps) => {
  // We need to render the editor
  const showEditor = useSelector(
    (state: RootState) =>
      !selectAddingToId(state.fileTree, props.id)
        ? false // not adding to this dir
        : selectAddingFile(state.fileTree)
        ? state.fileTree.dirs[props.id]?.fileIds.length === 0 // adding a file - only show if no files
        : true // not adding a file - show
  );

  const {
    innerNode,
    handleClick,
    className,
    // --- context menu ---
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
      <li className="w-full overflow-hidden">
        <DirectoryComponent
          depth={parts.length - 1}
          isOpen={props.isOpen}
          onClick={handleClick}
          title={props.namePath}
          className={className}
          onContextMenu={onContextMenu}
        >
          {innerNode}
        </DirectoryComponent>
      </li>

      {/* Dirs */}
      {showEditor && <AddItem />}

      {/* Context Menu */}
      {showMenu && (
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
