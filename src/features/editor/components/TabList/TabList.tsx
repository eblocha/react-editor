import { RootState } from "@/stores";
import { useSelector } from "react-redux";
import { Tab } from "../Tab";

const selector = (state: RootState) => state.editor.tabs.open;

export const TabList = () => {
  const open = useSelector(selector);

  return (
    <div className="flex flex-row items-center overflow-x-auto overflow-y-hidden h-8 bg-gray-300">
      {open.map((id, index) => (
        <Tab key={id} id={id} index={index} />
      ))}
    </div>
  );
};
