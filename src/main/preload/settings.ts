import { contextBridge, ipcRenderer } from 'electron';
import { Settings, UpdateStatus } from '../../shared/types';

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
  updater: {
    check: (): Promise<void> => ipcRenderer.invoke('update:check'),
    install: () => ipcRenderer.send('update:install'),
    quitAndInstall: () => ipcRenderer.send('update:quit-install'),
    onStatus: (callback: (status: UpdateStatus) => void) => {
      ipcRenderer.on('update:status', (_, status) => callback(status));
    },
  },
  app: {
    quit: () => ipcRenderer.send('app:quit'),
    getVersion: (): Promise<string> => ipcRenderer.invoke('app:version'),
    platform: process.platform,
  },
};

contextBridge.exposeInMainWorld('settingsAPI', api);

export type SettingsAPI = typeof api;
