import type { SettingsAPI } from '../main/preload/settings';
import type { OverlayAPI } from '../main/preload/overlay';

declare global {
  interface Window {
    settingsAPI: SettingsAPI;
    overlayAPI: OverlayAPI;
  }
}

export interface Settings {
  enabled: boolean;
  size: number;

  background: {
    color: string;
    opacity: number;
  };
  outline: {
    color: string;
    opacity: number;
    offset: number;
    width: number;
  };
}

export interface MousePosition {
  x: number;
  y: number;
}

export interface IpcChannels {
  SETTINGS_GET: 'settings:get';
  SETTINGS_SET: 'settings:set';
  SETTINGS_UPDATED: 'settings:updated';
  CURSOR_TOGGLE: 'cursor:toggle';
  CURSOR_POSITION: 'cursor:position';
  CLICK_EVENT: 'click:event';
  SHOW_SETTINGS: 'show:settings';
}
