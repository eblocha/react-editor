import { configureStore } from "@reduxjs/toolkit";
import { fileTreeReducer } from "@/features/fileTree";
import { editorReducer } from "@/features/editor";

export const store = configureStore({
  reducer: {
    fileTree: fileTreeReducer,
    editor: editorReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
