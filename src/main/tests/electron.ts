import { vi } from "vitest";
import { APP_PATH } from "./constants";

export const mockElectronAPIs = () => {
  vi.mock(import("electron"), async (importOriginal) => {
    const actual = await importOriginal();
    return {
      ...actual,
      app: {
        ...actual.app,
        getPath: () => APP_PATH,
      },
    };
  });
};
