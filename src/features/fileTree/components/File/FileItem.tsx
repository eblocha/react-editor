import { AppDispatch, RootState } from "@/stores";
import { getLast } from "@/utils";
import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { usePathParts } from "../../hooks";
import { setActive } from "../../store";
import { File } from "../../types";
import { FileComponent } from "./FileComponent";

type IProps = File & {
  path: string;
  namePath: string;
};

export const FileItem = (props: IProps) => {
  const parts = usePathParts(props.path);
  const isActive = useSelector(
    (state: RootState) => getLast(state.fileTree.activeItem) === props.id
  );

  const dispatch = useDispatch<AppDispatch>();

  const handleClick = useCallback(() => {
    dispatch(setActive(parts));
  }, [dispatch, parts]);

  return (
    <li className="w-full overflow-hidden">
      <FileComponent
        depth={parts.length - 1}
        name={props.name}
        title={props.namePath}
        onClick={handleClick}
        className={isActive ? "bg-gray-200" : undefined}
      />
    </li>
  );
};
