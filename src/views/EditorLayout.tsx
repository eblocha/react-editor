import { TabList } from "@/features/editor";

export const EditorLayout = () => {
  return (
    <div className="flex flex-col">
      <TabList />
      <div className="grow w-full" />
    </div>
  );
};
