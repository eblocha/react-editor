import { render, screen } from "@testing-library/react";
import { DirectoryComponent } from "./DirectoryComponent";

it("renders a closed folder", () => {
  render(<DirectoryComponent depth={0} isOpen={false} />);

  expect(screen.getByTestId("folder-icon-closed")).toBeInTheDocument();
  expect(screen.getByTestId("folder-icon-arrow")).not.toHaveClass("rotate-90");
});

it("renders an open folder", () => {
  render(<DirectoryComponent depth={0} isOpen={true} />);

  expect(screen.getByTestId("folder-icon-open")).toBeInTheDocument();
  expect(screen.getByTestId("folder-icon-arrow")).toHaveClass("rotate-90");
});

it("renders deeper folders with more padding", () => {
  render(
    <div>
      <DirectoryComponent depth={0} isOpen />
      <DirectoryComponent depth={1} isOpen={false} />
    </div>
  );

  const buttons = screen.getAllByRole("button");

  const parentBtn = buttons[0];
  const childBtn = buttons[1];

  if (!parentBtn || !childBtn) {
    throw new Error("not all elements rendered");
  }

  const { paddingLeft: parentPadding } = window.getComputedStyle(parentBtn);
  const { paddingLeft: childPadding } = window.getComputedStyle(childBtn);

  expect(parseInt(parentPadding.slice(0, -3))).toBeLessThan(
    parseInt(childPadding.slice(0, -3))
  );
});
