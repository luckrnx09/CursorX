import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { getPreload } from "./getPreload";
import { existsSync } from "fs";
import { join } from "path";

vi.mock("fs");

describe("getPreload", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("returns the correct preload path when file exists", () => {
    const preloadName = "overlay";
    vi.mocked(existsSync).mockReturnValue(true);

    const result = getPreload(preloadName);

    const expectedPath = join(__dirname, `../preload/${preloadName}.js`);
    expect(result).toBe(expectedPath);
    expect(existsSync).toHaveBeenCalledWith(expectedPath);
  });

  it("returns the correct preload path for settings when file exists", () => {
    const preloadName = "settings";
    vi.mocked(existsSync).mockReturnValue(true);

    const result = getPreload(preloadName);

    const expectedPath = join(__dirname, `../preload/${preloadName}.js`);
    expect(result).toBe(expectedPath);
    expect(existsSync).toHaveBeenCalledWith(expectedPath);
  });

  it("throws an error when preload file does not exist", () => {
    const preloadName = "nonexistent";
    vi.mocked(existsSync).mockReturnValue(false);

    const expectedPath = join(__dirname, `../preload/${preloadName}.js`);

    expect(() => getPreload(preloadName)).toThrow(
      `Preload script not found at ${expectedPath}`
    );
    expect(existsSync).toHaveBeenCalledWith(expectedPath);
  });

  it("throws an error with correct path when overlay preload does not exist", () => {
    const preloadName = "overlay";
    vi.mocked(existsSync).mockReturnValue(false);

    const expectedPath = join(__dirname, `../preload/${preloadName}.js`);

    expect(() => getPreload(preloadName)).toThrow(
      `Preload script not found at ${expectedPath}`
    );
  });

  it("throws an error with correct path when settings preload does not exist", () => {
    const preloadName = "settings";
    vi.mocked(existsSync).mockReturnValue(false);

    const expectedPath = join(__dirname, `../preload/${preloadName}.js`);

    expect(() => getPreload(preloadName)).toThrow(
      `Preload script not found at ${expectedPath}`
    );
  });

  it("handles different preload names correctly", () => {
    const preloadNames = ["overlay", "settings", "main", "custom"];
    vi.mocked(existsSync).mockReturnValue(true);

    preloadNames.forEach((name) => {
      const result = getPreload(name);
      expect(result).toContain(name);
      expect(result).toContain(".js");
    });

    expect(existsSync).toHaveBeenCalledTimes(preloadNames.length);
  });
});
