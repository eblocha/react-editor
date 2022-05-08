import styles from "./App.module.css";
import { StoreProvider } from "@/stores";
import Split from "react-split-grid";
import { FileTreeLayout, EditorLayout } from "@/layouts";

function App() {
  return (
    <StoreProvider>
      <main className={styles.main}>
        <Split
          snapOffset={0}
          cursor="col-resize"
          minSize={200}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore - TODO react-split-grid needs to fix
          render={({ getGridProps, getGutterProps }) => (
            <div {...getGridProps()} className={styles.splitGrid}>
              <FileTreeLayout />
              <div
                {...getGutterProps("column", 1)}
                className={styles.splitGutter}
              />
              <EditorLayout />
            </div>
          )}
        />
      </main>
    </StoreProvider>
  );
}

export default App;
