import { render, screen } from "@testing-library/react";
import { FileComponent } from "./FileComponent";

it("renders deeper files with more padding", () => {
  render(
    <div>
      <FileComponent depth={0} />
      <FileComponent depth={1} />
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
