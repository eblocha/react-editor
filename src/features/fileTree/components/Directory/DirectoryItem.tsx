import { AppDispatch, RootState } from "@/stores";
import { useCallback } from "react";
import { useDispatch, batch, useSelector } from "react-redux";
import { useChildIds, usePathParts } from "../../hooks";
import { toggleOpen, setActive } from "../../store";
import { Directory } from "../../types";
import { TreeItemComponent } from "../TreeItem";
import { DirectoryComponent } from "./DirectoryComponent";

type IProps = Directory & {
  path: string;
  namePath: string;
};

export const DirectoryItem = (props: IProps) => {
  const childIds = useChildIds(props.id);
  const parts = usePathParts(props.path);
  const isActive = useSelector(
    (state: RootState) => state.fileTree.activeDir === props.id
  );

  const dispatch = useDispatch<AppDispatch>();

  const handleClick = useCallback(() => {
    batch(() => {
      dispatch(toggleOpen(props.id));
      dispatch(setActive(parts));
    });
  }, [dispatch, parts, props.id]);

  return (
    <>
      <li className="w-full overflow-hidden">
        <DirectoryComponent
          depth={parts.length - 1}
          isOpen={props.isOpen}
          name={props.name}
          onClick={handleClick}
          title={props.namePath}
          className={isActive ? "bg-gray-200" : undefined}
        />
      </li>
      {props.isOpen &&
        childIds.map((id) => (
          <TreeItemComponent
            id={id}
            parentPath={props.path}
            parentNamePath={props.namePath}
            key={id}
          />
        ))}
    </>
  );
};
