import { injectable } from 'inversify';
import { MousePosition } from '../../shared/types';
import { getCursorScreenPoint } from '../utils/getCursorScreenPoint';

type CursorPositionChangeCallback = (position: MousePosition) => void;
type CursorTrackerOptions = {
  onPositionChange: CursorPositionChangeCallback;
};

const noop = () => {};
const DEFAULT_OPTIONS: CursorTrackerOptions = {
  onPositionChange: noop,
};

@injectable()
export class CursorTracker {
  private trackingInterval: NodeJS.Timeout | null = null;
  private lastPosition: MousePosition = { x: 0, y: 0 };
  private isTracking = false;
  private options: CursorTrackerOptions = DEFAULT_OPTIONS;

  start(options: CursorTrackerOptions) {
    if (this.isTracking) return;

    this.isTracking = true;
    this.options = options;
    this.trackingInterval = setInterval(() => {
      const point = getCursorScreenPoint();
      if (point.x !== this.lastPosition.x || point.y !== this.lastPosition.y) {
        this.lastPosition = { x: point.x, y: point.y };
        this.options.onPositionChange(this.lastPosition);
      }
    }, 16); // ~60fps
  }

  stop() {
    if (!this.isTracking) return;

    this.isTracking = false;

    if (this.trackingInterval) {
      clearInterval(this.trackingInterval);
      this.trackingInterval = null;
      this.lastPosition = { x: 0, y: 0 };
      this.options = DEFAULT_OPTIONS;
    }
  }
}
