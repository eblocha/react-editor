import { Toolbar, Tree } from "@/features/fileTree";

export const FileTreeLayout = () => {
  return (
    <div className="flex flex-col overflow-hidden h-full">
      <div className="shrink-0 bg-gray-300 py-1 px-2 flex flex-row items-center justify-between overflow-hidden">
        <span>File Tree</span>
        <Toolbar />
      </div>
      <div className="grow overflow-hidden">
        <Tree />
      </div>
    </div>
  );
};
