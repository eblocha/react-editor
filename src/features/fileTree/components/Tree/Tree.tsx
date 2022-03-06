import { useChildIds } from "../../hooks";
import { TreeItemComponent } from "../TreeItem";
import { FillArea } from "./FillArea";

export const Tree = () => {
  const childIds = useChildIds();

  return (
    <ul className="h-full w-full overflow-x-hidden overflow-y-auto flex flex-col">
      {childIds.map((id) => (
        <TreeItemComponent id={id} parentPath="" parentNamePath="" key={id} />
      ))}
      <li
        className="grow"
        style={{
          minHeight: "2rem",
        }}
      >
        <FillArea />
      </li>
    </ul>
  );
};
