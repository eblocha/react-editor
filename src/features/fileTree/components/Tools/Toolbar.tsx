import { AddDir } from "./AddDir";
import { AddFile } from "./AddFile";
import { Collapse } from "./Collapse";

export const Toolbar = () => {
  return (
    <div className="grid grid-cols-3 gap-1.5">
      <AddFile />
      <AddDir />
      <Collapse />
    </div>
  );
};
