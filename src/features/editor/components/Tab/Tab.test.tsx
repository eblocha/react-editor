import { initialState, TreeItems } from "@/features/fileTree";
import { render, screen, fireEvent } from "@/test-utils";
import { Tab } from "./Tab";

it("renders an active tab", () => {
  const id = "test-id";
  const name = "test-name";
  const index = 0;

  render(<Tab id={id} index={index} />, {
    preloadedState: {
      fileTree: {
        ...initialState,
        files: {
          [id]: {
            id,
            name,
            type: TreeItems.FILE,
          },
        },
      },
    },
  });

  const elem = screen.queryByTestId(`file-tab-activate-${id}`);
  expect(elem).not.toBeNull();

  elem && fireEvent.click(elem);

  expect(elem?.textContent).toBe(name);
  expect(screen.getByTestId(`file-tab-${id}`)).toHaveClass("bg-white");
});
