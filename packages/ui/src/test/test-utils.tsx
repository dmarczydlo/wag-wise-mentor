import {
  render,
  act,
  RenderOptions,
  RenderResult,
} from "@testing-library/react";
import { ReactElement } from "react";

export * from "@testing-library/react";

export const customRender = (
  ui: ReactElement,
  options: RenderOptions = {}
): RenderResult =>
  render(ui, {
    ...options,
  });
