// Testing utilities

import { render as rtlRender } from "@testing-library/react";
import { Provider } from "react-redux";

import { createStore, PreloadedState, store } from "../stores";

type Options = Parameters<typeof rtlRender>[1];

type RenderProps = {
  preloadedState?: PreloadedState;
  store?: typeof store;
} & Options;

const render = (
  ui: React.ReactElement,
  {
    preloadedState,
    store = createStore(preloadedState),
    ...renderOptions
  }: RenderProps = {}
) => {
  const Wrapper: React.FC = ({ children }) => {
    return <Provider store={store}>{children}</Provider>;
  };

  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
};

export * from "@testing-library/react";
export { render };
