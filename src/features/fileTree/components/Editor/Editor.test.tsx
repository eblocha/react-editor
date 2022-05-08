import { render, screen, fireEvent } from "@testing-library/react";
import { Editor } from "./Editor";

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noOp = () => {};

it("starts with the initial name value", () => {
  render(<Editor onAbort={noOp} onSubmit={noOp} initialName="initial-name" />);

  const elem = screen.getByDisplayValue("initial-name");

  expect(elem).toBeInTheDocument();
});

it("autofocuses", () => {
  render(<Editor onAbort={noOp} onSubmit={noOp} initialName="initial-name" />);

  const elem = screen.getByDisplayValue("initial-name");

  expect(document.activeElement).toEqual(elem);
});

it("calls the abort function when the element is blurred", () => {
  const onAbort = jest.fn();
  render(
    <Editor onAbort={onAbort} onSubmit={noOp} initialName="initial-name" />
  );

  fireEvent.blur(screen.getByTestId("editor"));
  expect(onAbort).toBeCalledTimes(1);
});

it("calls the submit function when enter is pressed", () => {
  const onSubmit = jest.fn();
  render(
    <Editor onAbort={noOp} onSubmit={onSubmit} initialName="initial-name" />
  );

  const newName = "abc";

  const elem = screen.getByTestId("editor");

  fireEvent.change(elem, { target: { value: newName } });

  fireEvent.submit(elem);
  expect(onSubmit).toBeCalledTimes(1);
  expect(onSubmit).toBeCalledWith(newName);
});

it("does not call submit if the name was removed", () => {
  const onSubmit = jest.fn();
  render(
    <Editor onAbort={noOp} onSubmit={onSubmit} initialName="initial-name" />
  );

  const elem = screen.getByTestId("editor");

  fireEvent.change(elem, { target: { value: "" } });

  fireEvent.submit(elem);
  expect(onSubmit).not.toBeCalled();
});
