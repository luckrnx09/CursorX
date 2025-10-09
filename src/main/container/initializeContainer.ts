import { Container } from 'inversify';
import { OverlayManager } from '../core/OverlayManager';
import { CursorTracker } from '../core/CursorTracker';
import { SettingsManager } from '../core/SettingsManager';

export const initializeContainer = () => {
  const container = new Container();

  container.bind(SettingsManager).toSelf().inSingletonScope();
  container.bind(CursorTracker).toSelf().inSingletonScope();
  container.bind(OverlayManager).toSelf().inSingletonScope();

  return container;
};
