import { VscNewFile } from "react-icons/vsc";

export const AddFile = () => {
  const title = "New File";

  return (
    <button className="text-btn block" title={title} aria-label={title}>
      <VscNewFile />
    </button>
  );
};
