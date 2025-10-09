import { describe, expect, it, vi, afterEach } from 'vitest';
import { getCursorScreenPoint } from './getCursorScreenPoint';
import { screen } from 'electron';

vi.mock('electron', () => ({
  screen: {
    getCursorScreenPoint: vi.fn(),
  },
}));

describe('getCursorScreenPoint', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('returns cursor position from electron screen API', () => {
    const mockPosition = { x: 100, y: 200 };
    vi.mocked(screen.getCursorScreenPoint).mockReturnValue(mockPosition);

    const result = getCursorScreenPoint();

    expect(result).toEqual(mockPosition);
    expect(screen.getCursorScreenPoint).toHaveBeenCalledTimes(1);
  });
});
