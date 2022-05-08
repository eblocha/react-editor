import { Editor, TabList } from "@/features/editor";

export const EditorLayout = () => {
  return (
    <div className="flex flex-col overflow-hidden">
      <TabList />
      <div className="grow w-full">
        <Editor />
      </div>
    </div>
  );
};
