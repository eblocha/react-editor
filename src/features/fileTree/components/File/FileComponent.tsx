import { ButtonHTMLAttributes, forwardRef } from "react";
import { FaFile } from "react-icons/fa";
import styles from "../TreeItem.module.css";

export type FileProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  depth: number;
};

const FileComponent = forwardRef<HTMLButtonElement, FileProps>(
  ({ children, depth, style, className, ...props }, ref) => {
    return (
      <button
        className={`${styles.treeItem} ${className || ""}`}
        style={{
          paddingLeft: depth / 2 + 0.5 + "rem",
          ...style,
        }}
        ref={ref}
        {...props}
      >
        <div className="w-4 mr-1" />
        <FaFile className="text-blue-500 mr-2" />
        <span className="grow overflow-hidden overflow-ellipsis">
          {children}
        </span>
      </button>
    );
  }
);

FileComponent.displayName = "File";

export { FileComponent };
