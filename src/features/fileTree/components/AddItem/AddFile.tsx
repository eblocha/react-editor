import { AppDispatch } from "@/stores";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { abortCreate, createFile } from "../../store";
import { FileComponent } from "../File";
import { Editor } from "../Editor";

type IProps = {
  path: string[];
};

export const AddFile = ({ path }: IProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = useCallback(
    (name: string) => {
      dispatch(
        createFile({
          name,
          parent: path,
        })
      );
    },
    [dispatch, path]
  );

  const handleAbort = useCallback(() => {
    dispatch(abortCreate());
  }, [dispatch]);

  return (
    <FileComponent depth={path.length} className="z-10 bg-white">
      <Editor onSubmit={handleSubmit} onAbort={handleAbort} />
    </FileComponent>
  );
};
