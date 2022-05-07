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
    useCallback(
      (state: RootState) => state.fileTree.files[id]?.name ?? null,
      [id]
    )
  );

  const lastKnownName = useRef(name);

  useEffect(() => {
    if (name !== undefined) {
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
    <div
      className={
        styles.tab + (isActive ? " bg-white" : " bg-gray-100") + " group"
      }
    >
      <button
        className="grow h-full overflow-hidden overflow-ellipsis text-left"
        onClick={handleOpen}
      >
        {name ?? lastKnownName.current}
      </button>
      <CloseButton isActive={isActive} onClick={handleClose} />
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
    >
      <VscClose />
    </button>
  );
};
