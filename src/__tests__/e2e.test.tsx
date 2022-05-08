import App from "@/App";
import { fireEvent, render, screen, within } from "@testing-library/react";

describe("item lifecycle", () => {
  it("creates, renames, and deletes a series of items", () => {
    render(<App />);

    const fileTree = () => screen.getByTestId("file-tree-layout");
    const editor = () => screen.getByTestId("editor-layout");
    const ctxMenu = () => screen.getByTestId("context-menu");
    const getInput = () => screen.getByTestId("editor");

    // click the "new folder" button
    fireEvent.click(screen.getByTitle(/new folder/i));

    // create the folder ------------------------------------------------------
    let dirName = "root";
    let input = getInput();
    fireEvent.change(input, { target: { value: dirName } });

    fireEvent.submit(input);

    expect(screen.queryByText(dirName)).toBeInTheDocument();
    expect(screen.queryByTestId("folder-icon-closed")).toBeInTheDocument();

    // create a file under this folder ----------------------------------------
    let fileName = "my-file";

    fireEvent.contextMenu(screen.getByText(dirName));
    fireEvent.click(within(ctxMenu()).getByText(/new file/i));
    input = getInput();
    fireEvent.change(input, { target: { value: fileName } });

    fireEvent.submit(input);

    // should have a file in the tree, and a file tab open
    expect(within(fileTree()).getByText(fileName)).toBeInTheDocument();
    expect(within(editor()).getByText(fileName)).toBeInTheDocument();
    expect(screen.queryByTestId("folder-icon-open")).toBeInTheDocument();

    // rename the file --------------------------------------------------------
    // it should update in the tree and open tab
    fireEvent.contextMenu(within(fileTree()).getByText(fileName));

    fileName = "my-file-renamed";

    fireEvent.click(within(ctxMenu()).getByText(/rename/i));
    input = getInput();
    fireEvent.change(input, { target: { value: fileName } });
    fireEvent.submit(input);

    expect(within(fileTree()).getByText(fileName)).toBeInTheDocument();
    expect(within(editor()).getByText(fileName)).toBeInTheDocument();

    // rename the folder ------------------------------------------------------
    // The folder name in the tree should be updated
    fireEvent.contextMenu(within(fileTree()).getByText(dirName));
    dirName = "root-renamed";

    fireEvent.click(within(ctxMenu()).getByText(/rename/i));
    input = getInput();
    fireEvent.change(input, { target: { value: dirName } });
    fireEvent.submit(input);
    expect(within(fileTree()).getByText(dirName)).toBeInTheDocument();

    // close the folder (click it) --------------------------------------------
    // The file should now be hidden in the tree, but visible in the editor
    fireEvent.click(within(fileTree()).getByText(dirName));

    expect(within(fileTree()).queryAllByText(fileName).length).toBe(0);
    expect(within(editor()).getByText(fileName)).toBeInTheDocument();

    // delete the folder ------------------------------------------------------
    // the file should still have a tab, but with a strikethrough

    // open the folder first
    fireEvent.click(within(fileTree()).getByText(dirName));

    fireEvent.contextMenu(within(fileTree()).getByText(dirName));
    fireEvent.click(within(ctxMenu()).getByText(/delete/i));

    // check for removed items
    expect(within(fileTree()).queryAllByText(fileName).length).toBe(0);
    expect(within(fileTree()).queryAllByText(dirName).length).toBe(0);

    // file tab should still be in the editor
    const editorTab = within(editor()).getByText(fileName);
    expect(editorTab).toBeInTheDocument();
    expect(editorTab).toHaveClass("line-through");
  });
});
