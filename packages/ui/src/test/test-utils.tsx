import { render } from "@testing-library/react";
import { ReactElement } from "react";

export * from "@testing-library/react";

export const customRender = (ui: ReactElement, options = {}) =>
  render(ui, {
    ...options,
  });
