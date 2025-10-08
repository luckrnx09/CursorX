import { afterEach, describe, expect, it, vi } from "vitest";
import { initializeContainer } from "../container/initializeContainer";
import { CursorTracker } from "./CursorTracker";
import { getCursorScreenPoint } from "../utils/getCursorScreenPoint";
import { MousePosition } from "../../shared/types";

vi.useFakeTimers();

vi.mock('../utils/getCursorScreenPoint');

describe("CursorTracker", () => {
  it("starts tracking cursor position", () => {
    const container = initializeContainer();
    const cursorTracker = container.get(CursorTracker);
    const callback = vi.fn();
    testTrackingCursorPosition(cursorTracker, callback);
  });

  it("stops tracking cursor position", () => {
    const container = initializeContainer();
    const cursorTracker = container.get(CursorTracker);
    const callback = vi.fn();
    testTrackingCursorPosition(cursorTracker, callback);
    
    cursorTracker.stop();

    vi.mocked(getCursorScreenPoint).mockReturnValue({ x: 300, y: 300 });
    vi.advanceTimersByTime(16);
    expect(callback).not.toHaveBeenCalledWith({ x: 300, y: 300 });
  });
});

const testTrackingCursorPosition = (cursorTracker: CursorTracker, callback: (position: MousePosition) => void) => {
  vi.mocked(getCursorScreenPoint).mockReturnValue({ x: 100, y: 100 });
  cursorTracker.start({
    onPositionChange: callback
  });
  vi.advanceTimersByTime(16);
  expect(callback).toHaveBeenCalledWith({ x: 100, y: 100 });
  vi.mocked(getCursorScreenPoint).mockReturnValue({ x: 200, y: 200 });
  vi.advanceTimersByTime(16);
  expect(callback).toHaveBeenCalledWith({ x: 200, y: 200 });
}
