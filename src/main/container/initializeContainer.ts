import { Container } from 'inversify';
import { OverlayManager } from '../core/OverlayManager';
import { CursorTracker } from '../core/CursorTracker';
import { SettingsManager } from '../core/SettingsManager';
import { UpdaterService } from '../core/UpdaterService';

export const initializeContainer = () => {
  const container = new Container();

  container.bind(SettingsManager).toSelf().inSingletonScope();
  container.bind(CursorTracker).toSelf().inSingletonScope();
  container.bind(OverlayManager).toSelf().inSingletonScope();
  container.bind(UpdaterService).toSelf().inSingletonScope();

  return container;
};
