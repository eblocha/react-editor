import { screen, fireEvent } from "@/test-utils";
import { render as rtlRender } from "@testing-library/react";
import { TabInner } from "./Tab";

it("renders a tab and fires events", () => {
  const id = "test-id";
  const name = "test-name";

  const onClick = jest.fn();
  const onClose = jest.fn();

  rtlRender(
    <TabInner id={id} name={name} onClick={onClick} onClose={onClose} />
  );

  const nameElem = screen.getByText(name);

  expect(nameElem).toBeInTheDocument();

  const closeBtn = screen.queryByTestId("file-tab-close");
  expect(closeBtn).not.toBeNull();

  fireEvent.click(nameElem);
  expect(onClick).toBeCalledTimes(1);

  closeBtn && fireEvent.click(closeBtn);
  expect(onClose).toBeCalledTimes(1);
});

it("renders an active tab properly", () => {
  const id = "test-id";
  const name = "test-name";

  rtlRender(<TabInner id={id} name={name} isActive />);

  expect(screen.getByTestId(`file-tab-${id}`)).toHaveClass("bg-white");
});

it("renders a deleted tab properly", () => {
  const id = "test-id";
  const name = "test-name";

  rtlRender(<TabInner id={id} name={name} isDeleted />);

  expect(screen.getByText(name)).toHaveClass("line-through");
});
