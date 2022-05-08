import { AppDispatch } from "@/stores";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { abortCreate, createDir } from "../../store";
import { DirectoryComponent } from "../Directory";
import { Editor } from "../Editor";

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

  const handleAbort = useCallback(() => {
    dispatch(abortCreate());
  }, [dispatch]);

  return (
    <DirectoryComponent
      depth={path.length}
      isOpen={false}
      className="z-10 bg-white"
    >
      <Editor onSubmit={handleSubmit} onAbort={handleAbort} />
    </DirectoryComponent>
  );
};
