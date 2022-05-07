export type OpenFile = {
  /** The file ID in the file tree */
  id: string;
  /** The content that was last saved */
  content: string;
  /** The unsaved content, or null if not edited */
  unsavedContent: string | null;
  /** The file is deleted from the tree. The file can remain "open", but the user cannot save it. */
  isDeleted: boolean;
};

export type TabState = {
  /** File ids that are open */
  open: string[];
  /** Used to determine which file to switch to when one is closed */
  history: string[];
  /** The currently active file */
  active: string | null;
};

export type EditorState = {
  /** Mapping of file id to text content */
  files: Record<string, OpenFile>;
  tabs: TabState;
};
