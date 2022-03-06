import { VscNewFolder } from "react-icons/vsc";

export const AddDir = () => {
  const title = "New Folder";

  return (
    <button className="text-btn block" title={title} aria-label={title}>
      <VscNewFolder />
    </button>
  );
};
