import { ContextMenu, Divider, MenuItem } from "@/features/contextmenu";
import { AppDispatch } from "@/stores";
import { CSSProperties, forwardRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { useDispatch } from "react-redux";
import { deleteItem, startCreateDir, startCreateFile } from "../../store";

type IProps = {
  id: string;
  path: string[];
  namePath: string;
  setIsRenaming: (renaming: boolean) => void;
  menuStyle: CSSProperties;
  setShow: (show: boolean) => void;
};

const FileContextMenu = forwardRef<HTMLDivElement, IProps>(
  ({ path, namePath, setIsRenaming, setShow, menuStyle }, ref) => {
    const dispatch = useDispatch<AppDispatch>();

    const handleRename = useCallback(() => {
      setIsRenaming(true);
      setShow(false);
    }, [setIsRenaming, setShow]);

    const handleAddFile = useCallback(() => {
      dispatch(startCreateFile(path.slice(0, -2)));
      setShow(false);
    }, [dispatch, path, setShow]);

    const handleAddDir = useCallback(() => {
      dispatch(startCreateDir(path.slice(0, -2)));
      setShow(false);
    }, [dispatch, path, setShow]);

    const handleCopyPath = useCallback(() => {
      navigator.clipboard.writeText(namePath);
      setShow(false);
    }, [namePath, setShow]);

    const handleDelete = useCallback(() => {
      dispatch(
        deleteItem({
          path,
        })
      );
    }, [dispatch, path]);

    return createPortal(
      <ContextMenu style={menuStyle} ref={ref}>
        <MenuItem onClick={handleAddFile}>New File</MenuItem>
        <MenuItem onClick={handleAddDir}>New Folder</MenuItem>
        <Divider />
        <MenuItem>Cut</MenuItem>
        <MenuItem>Copy</MenuItem>
        <MenuItem>Paste</MenuItem>
        <Divider />
        <MenuItem onClick={handleCopyPath}>Copy Path</MenuItem>
        <Divider />
        <MenuItem onClick={handleRename}>Rename</MenuItem>
        <MenuItem onClick={handleDelete}>Delete</MenuItem>
      </ContextMenu>,
      document.body
    );
  }
);

FileContextMenu.displayName = "FileContextMenu";

export { FileContextMenu };
