import { useChildIds } from "../../hooks";
import { TreeItemComponent } from "../TreeItem";

export const Tree = () => {
  const childIds = useChildIds();

  return (
    <ul className="w-full h-full overflow-x-hidden overflow-y-auto">
      {childIds.map((id) => (
        <TreeItemComponent id={id} parentPath="" parentNamePath="" key={id} />
      ))}
    </ul>
  );
};
