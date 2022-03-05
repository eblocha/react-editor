import { usePathParts } from "../../hooks";
import { File } from "../../types";
import { FileComponent } from "./FileComponent";

type IProps = File & {
  path: string;
  namePath: string;
};

export const FileItem = (props: IProps) => {
  const parts = usePathParts(props.path);

  return (
    <li className="w-full overflow-hidden">
      <FileComponent
        depth={parts.length - 1}
        name={props.name}
        title={props.namePath}
      />
    </li>
  );
};
