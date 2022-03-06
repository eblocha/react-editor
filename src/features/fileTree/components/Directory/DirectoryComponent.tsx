import { FaAngleRight, FaFolder, FaFolderOpen } from "react-icons/fa";
import { ButtonHTMLAttributes, forwardRef } from "react";
import styles from "../TreeItem.module.css";

export type DirectoryProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isOpen: boolean;
  depth: number;
};

const DirectoryComponent = forwardRef<HTMLButtonElement, DirectoryProps>(
  ({ isOpen, children, depth, className, style, ...props }, ref) => {
    return (
      <button
        className={`${styles.treeItem} ${className || ""}`}
        style={{
          paddingLeft: depth / 2 + 0.5 + "rem",
          ...style,
        }}
        {...props}
        ref={ref}
      >
        <FaAngleRight className={`mr-1${isOpen ? " rotate-90" : ""} w-4`} />
        {isOpen ? (
          <FaFolderOpen className="text-yellow-500 mr-2" />
        ) : (
          <FaFolder className="text-yellow-500 mr-2" />
        )}
        <span className="grow overflow-hidden overflow-ellipsis">
          {children}
        </span>
      </button>
    );
  }
);

DirectoryComponent.displayName = "Directory";

export { DirectoryComponent };
