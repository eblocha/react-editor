import styles from "./App.module.css";
import { StoreProvider } from "@/stores";
import { Tree, Toolbar } from "@/features/fileTree";
import Split from "react-split-grid";

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
              <div className="flex flex-col overflow-hidden h-full">
                <div className="shrink-0 bg-gray-300 py-1 px-2 flex flex-row items-center justify-between overflow-hidden">
                  <span>File Tree</span>
                  <Toolbar />
                </div>
                <div className="grow overflow-hidden">
                  <Tree />
                </div>
              </div>
              <div
                {...getGutterProps("column", 1)}
                className={styles.splitGutter}
              />
              <div />
            </div>
          )}
        />
      </main>
    </StoreProvider>
  );
}

export default App;
