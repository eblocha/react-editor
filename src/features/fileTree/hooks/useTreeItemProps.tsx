import { useContextMenu } from "@/features/contextmenu";
import { AppDispatch, RootState } from "@/stores";
import { getLast } from "@/utils";
import { useCallback, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Editor } from "../components/Editor";
import { rename, treeItemClicked } from "../store";
import { usePathParts } from "./usePathParts";

type IProps = {
  /** The item id */
  id: string;
  /** The id-based path */
  path: string;
  /** The index of the item in the rendered tree */
  index: number;
  /** The item's display name */
  name: string;
};

/** Common computed properties for tree items */
export const useTreeItemProps = (props: IProps) => {
  const parts = usePathParts(props.path);
  const isActive = useSelector(
    (state: RootState) => getLast(state.fileTree.activeItem) === props.id
  );

  // indicates that the item is in the list selection data
  const isSelected = useSelector(
    (state: RootState) => props.index in state.fileTree.selectionData.selected
  );

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

  const innerNode = isRenaming ? (
    <Editor
      onAbort={handleAbort}
      onSubmit={handleRename}
      initialName={props.name}
    />
  ) : (
    props.name
  );

  const className = isHighlighted
    ? "bg-gray-200"
    : isSelected
    ? "bg-gray-100"
    : undefined;

  return {
    handleClick,
    innerNode,
    className,
    // --- context menu ---
    setIsRenaming,
    setShow,
    menuRef,
    showMenu: show,
    onContextMenu,
    menuStyle,
    parts,
  };
};
