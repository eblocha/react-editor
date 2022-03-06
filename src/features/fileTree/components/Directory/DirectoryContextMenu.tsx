import { ContextMenu, Divider, MenuItem } from "@/features/contextmenu";
import { CSSProperties, forwardRef, useCallback } from "react";
import { createPortal } from "react-dom";

type IProps = {
  id: string;
  setIsRenaming: (renaming: boolean) => void;
  menuStyle: CSSProperties;
  setShow: (show: boolean) => void;
};

const DirectoryContextMenu = forwardRef<HTMLDivElement, IProps>(
  ({ setIsRenaming, setShow, menuStyle }, ref) => {
    const handleRename = useCallback(() => {
      setIsRenaming(true);
      setShow(false);
    }, [setIsRenaming, setShow]);

    return createPortal(
      <ContextMenu style={menuStyle} ref={ref}>
        <MenuItem>New File</MenuItem>
        <MenuItem>New Folder</MenuItem>
        <Divider />
        <MenuItem>Cut</MenuItem>
        <MenuItem>Copy</MenuItem>
        <MenuItem>Paste</MenuItem>
        <Divider />
        <MenuItem onClick={handleRename}>Rename</MenuItem>
        <MenuItem>Delete</MenuItem>
      </ContextMenu>,
      document.body
    );
  }
);

DirectoryContextMenu.displayName = "DirectoryContextMenu";

export { DirectoryContextMenu };
