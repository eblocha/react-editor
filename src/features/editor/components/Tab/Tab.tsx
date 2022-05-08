import { AppDispatch, RootState } from "@/stores";
import { useCallback, useEffect, useRef } from "react";
import { VscClose } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import { closeTabs, openFile } from "../../store";
import styles from "./Tab.module.css";

type TabProps = {
  id: string;
  index: number;
};

export const Tab = ({ id, index }: TabProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const name = useSelector(
    useCallback((state: RootState) => state.fileTree.files[id]?.name, [id])
  );

  const isDeleted = useSelector(
    useCallback(
      (state: RootState) => state.editor.files[id]?.isDeleted ?? false,
      [id]
    )
  );

  const lastKnownName = useRef(name);

  useEffect(() => {
    if (name) {
      lastKnownName.current = name;
    }
  }, [name]);

  const isActive = useSelector(
    (state: RootState) => state.editor.tabs.active == id
  );

  const handleOpen = useCallback(() => {
    dispatch(openFile({ id }));
  }, [dispatch, id]);

  const handleClose = useCallback(() => {
    dispatch(closeTabs([index]));
  }, [dispatch, index]);

  return (
    <TabInner
      id={id}
      name={name ?? lastKnownName.current ?? ""}
      isActive={isActive}
      isDeleted={isDeleted}
      onClick={handleOpen}
      onClose={handleClose}
    />
  );
};

type InnerTabProps = {
  id: string;
  name: string;
  isActive?: boolean;
  isDeleted?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  onClose?: React.MouseEventHandler<HTMLButtonElement>;
};

export const TabInner = ({
  id,
  name,
  isActive,
  isDeleted,
  onClick,
  onClose,
}: InnerTabProps) => {
  return (
    <div
      className={
        styles.tab + (isActive ? " bg-white" : " bg-gray-200") + " group"
      }
      data-testid={`file-tab-${id}`}
    >
      <button
        className={`grow h-full overflow-hidden overflow-ellipsis text-left pr-2${
          isDeleted ? " line-through text-red-700" : ""
        }`}
        onClick={onClick}
        data-testid={`file-tab-activate-${id}`}
      >
        {name}
      </button>
      <CloseButton isActive={isActive ?? false} onClick={onClose} />
    </div>
  );
};

type CloseButtonProps = {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  isActive: boolean;
};

const CloseButton = ({ isActive, onClick }: CloseButtonProps) => {
  return (
    <button
      className={`shrink-0 h-full bg-transparent hover:bg-gray-300 p-1 rounded ${
        isActive ? "" : " opacity-0 group-hover:opacity-100 focus:opacity-100"
      }`}
      onClick={onClick}
      data-testid="file-tab-close"
    >
      <VscClose />
    </button>
  );
};
