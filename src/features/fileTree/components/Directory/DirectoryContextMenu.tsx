import { ContextMenu, MenuItem } from "@/features/contextmenu";
import { CSSProperties, useCallback } from "react";
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

export const DirectoryContextMenu = ({
  setIsRenaming,
  setShow,
  menuStyle,
}: IProps) => {
  const handleRename = useCallback(() => {
    setIsRenaming(true);
    setShow(false);
  }, [setIsRenaming, setShow]);

  return createPortal(
    <ContextMenu style={menuStyle}>
      <MenuItem onClick={handleRename}>Rename</MenuItem>
      <MenuItem>Cut</MenuItem>
      <MenuItem>Copy</MenuItem>
      <MenuItem>Paste</MenuItem>
      <MenuItem>Delete</MenuItem>
    </ContextMenu>,
    document.body
  );
};
