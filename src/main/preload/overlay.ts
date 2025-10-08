import { contextBridge, ipcRenderer } from 'electron';
import { Settings, MousePosition,  } from '../../shared/types';

const overlayAPI = {
  getSettings: () => ipcRenderer.invoke('settings:get'),
  getCursorPosition: () => ipcRenderer.invoke('cursor:position:get'),
  onCursorPositionChange: (callback: (position: MousePosition) => void) => {
    ipcRenderer.on('cursor:position', (_, position) => callback(position));
  },
  onSettingsUpdate: (callback: (settings: Settings) => void) => {
    ipcRenderer.on('settings:update', (_, settings) => callback(settings));
  },
};

contextBridge.exposeInMainWorld('overlayAPI', overlayAPI);

export type OverlayAPI = typeof overlayAPI;