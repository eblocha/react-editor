import { ContextMenu, MenuItem } from "@/features/contextmenu";
import { CSSProperties, forwardRef, useCallback } from "react";
import { createPortal } from "react-dom";

type IProps = {
  id: string;
  setIsRenaming: (renaming: boolean) => void;
  menuStyle: CSSProperties;
  setShow: (show: boolean) => void;
};

/*
actions:
- rename
- cut
- copy
- paste
- delete
*/

const DirectoryContextMenu = forwardRef<HTMLDivElement, IProps>(
  ({ setIsRenaming, setShow, menuStyle }, ref) => {
    const handleRename = useCallback(() => {
      setIsRenaming(true);
      setShow(false);
    }, [setIsRenaming, setShow]);

    return createPortal(
      <ContextMenu style={menuStyle} ref={ref}>
        <MenuItem onClick={handleRename}>Rename</MenuItem>
        <MenuItem>Cut</MenuItem>
        <MenuItem>Copy</MenuItem>
        <MenuItem>Paste</MenuItem>
        <MenuItem>Delete</MenuItem>
      </ContextMenu>,
      document.body
    );
  }
);

DirectoryContextMenu.displayName = "DirectoryContextMenu";

export { DirectoryContextMenu };
