import { RootState } from "@/stores";
import { useSelector } from "react-redux";

export const Editor = () => {
  const id = useSelector((state: RootState) => state.editor.tabs.active);

  return (
    <div className="w-full h-full overflow-auto px-2">
      {id ? (
        <textarea className="w-full h-full resize-none focus:outline-none" />
      ) : null}
    </div>
  );
};
