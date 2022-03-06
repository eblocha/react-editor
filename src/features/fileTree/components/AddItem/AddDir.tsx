import { AppDispatch } from "@/stores";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { createDir } from "../../store";
import { DirectoryComponent } from "../Directory";
import { Editor } from "./Editor";

type IProps = {
  path: string[];
};

export const AddDir = ({ path }: IProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = useCallback(
    (name: string) => {
      dispatch(
        createDir({
          name,
          parent: path,
        })
      );
    },
    [dispatch, path]
  );

  return (
    <DirectoryComponent depth={path.length} isOpen={false}>
      <Editor onSubmit={handleSubmit} />
    </DirectoryComponent>
  );
};
