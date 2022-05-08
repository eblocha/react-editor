import {
  configureStore,
  PreloadedState as ReduxPreloadState,
} from "@reduxjs/toolkit";
import { fileTreeReducer, FileTreeState } from "@/features/fileTree";
import { editorReducer, EditorState } from "@/features/editor";

export type RootState = {
  fileTree: FileTreeState;
  editor: EditorState;
};

export type PreloadedState = ReduxPreloadState<RootState>;

export const createStore = (preloadedState?: PreloadedState) => {
  return configureStore<RootState>({
    reducer: {
      fileTree: fileTreeReducer,
      editor: editorReducer,
    },
    preloadedState,
  });
};

export const store = createStore();

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
