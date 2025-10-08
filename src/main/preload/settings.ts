import { contextBridge, ipcRenderer } from 'electron';
import { Settings } from '../../shared/types';

const api = {
  settings: {
    get: (): Promise<Settings> => ipcRenderer.invoke('settings:get'),
    set: (settings: Settings): Promise<boolean> => ipcRenderer.invoke('settings:set', settings),
    onUpdated: (callback: (settings: Settings) => void) => {
      ipcRenderer.on('settings:updated', (_, settings) => callback(settings));
    },
  },
  cursor: {
    toggle: () => ipcRenderer.send('cursor:toggle'),
  },
  app: {
    quit: () => ipcRenderer.send('app:quit'),
  },
};

contextBridge.exposeInMainWorld('settingsAPI', api);

export type SettingsAPI = typeof api;