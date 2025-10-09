import { app, BrowserWindow, Tray, Menu, ipcMain, globalShortcut, shell } from 'electron';
import { join } from 'path';
import { SettingsManager } from './core/SettingsManager';
import { CursorTracker } from './core/CursorTracker';
import { OverlayManager } from './core/OverlayManager';
import { getCursorScreenPoint } from './utils/getCursorScreenPoint';
import { initializeContainer } from './container/initializeContainer';
import { getPreload } from './utils/getPreload';

class CursorX {
  private tray: Tray | null = null;
  private settingsWindow: BrowserWindow | null = null;
  private settingsManager: SettingsManager;
  private cursorTracker: CursorTracker;
  private overlayManager: OverlayManager;

  constructor() {
    const container = initializeContainer();
    this.settingsManager = container.get(SettingsManager);
    this.cursorTracker = container.get(CursorTracker);
    this.overlayManager = container.get(OverlayManager);
  }

  async start() {
    // Request single instance lock
    const gotTheLock = app.requestSingleInstanceLock();

    if (!gotTheLock) {
      // Another instance is already running, quit this instance
      app.quit();
      return;
    }

    await app.whenReady();
    
    app.dock?.hide();
    
    this.createTray();
    this.setupIpcHandlers();
    this.initializeCursorTracking();
    
    app.on('window-all-closed', (e: Event) => {
      e.preventDefault();
    });

    app.on('before-quit', () => {
      this.cleanup();
    });
  }

  private createTray() {
    const iconPath = join(__dirname, './assets/tray/DisabledIconTemplate.png');
    this.tray = new Tray(iconPath);
    
    this.updateTrayMenu();
    
    this.tray.setToolTip('CursorX - Cursor Highlighting Tool');
  }

  private updateTrayMenu() {
    if (!this.tray) return;

    const settings = this.settingsManager.getSettings();
    const loginItemSettings = app.getLoginItemSettings();
    const contextMenu = Menu.buildFromTemplate([
      {
        type: 'checkbox',
        label: 'Enable CursorX',
        checked: settings.enabled,
        click: () => this.toggleCursorX(),
      },
      { type: 'separator' },
      {
        label: 'Start at login',
        type: 'checkbox',
        checked: loginItemSettings.openAtLogin,
        click: () => this.toggleStartAtLogin(),
      },
      { type: 'separator' },
      {
        label: 'Settings',
        click: () => this.showSettings(),
      },
      { type: 'separator' },
      {
        label: 'About',
        click: () => shell.openExternal('https://github.com/luckrnx09/CursorX.git'),
      },
      {
        label: 'Quit',
        click: () => {
          app.quit();
        },
      },
    ]);

    this.tray.setContextMenu(contextMenu);
    
    if (settings.enabled) {
      this.tray.setImage(join(__dirname, './assets/tray/EnabledIconTemplate.png'));
    } else {
      this.tray.setImage(join(__dirname, './assets/tray/DisabledIconTemplate.png'));
    }
  }

  private toggleCursorX() {
    const settings = this.settingsManager.getSettings();
    const newSettings = { ...settings, enabled: !settings.enabled };
    this.settingsManager.updateSettings(newSettings);
    
    if (newSettings.enabled) {
      this.startCursorTracking();
    } else {
      this.stopCursorTracking();
    }
    
    this.updateTrayMenu();
  }

  private toggleStartAtLogin() {
    const loginItemSettings = app.getLoginItemSettings();
    const shouldOpenAtLogin = !loginItemSettings.openAtLogin;
    
    app.setLoginItemSettings({
      openAtLogin: shouldOpenAtLogin,
      openAsHidden: false,
    });
    
    this.updateTrayMenu();
  }

  private showSettings() {
    if (this.settingsWindow) {
      this.settingsWindow.focus();
      return;
    } 
    
    this.settingsWindow = new BrowserWindow({
      useContentSize: true,
      show: false,
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        preload: getPreload('settings'),
      },
      title: ''
    });

    const isDev = process.env.NODE_ENV === 'development';
    
    if (isDev) {
      this.settingsWindow.loadURL('http://localhost:3000/settings.html');
    } else {
      this.settingsWindow.loadFile(join(__dirname, '../renderer/settings.html'));
    }

    this.settingsWindow.once('ready-to-show', () => {
      this.settingsWindow?.show();
    });

    this.settingsWindow.on('closed', () => {
      this.settingsWindow = null;
    });
  }

  private setupIpcHandlers() {
    ipcMain.handle('settings:get', () => {
      return this.settingsManager.getSettings();
    });

    ipcMain.handle('settings:set', (_, settings) => {
      this.settingsManager.updateSettings(settings);
      this.updateCursorTracking();
      return true;
    });

    ipcMain.handle('cursor:position:get', () => {
      return getCursorScreenPoint()
    });

    ipcMain.on('cursor:toggle', () => {
      this.toggleCursorX();
    });
  }

  private initializeCursorTracking() {
    const settings = this.settingsManager.getSettings();
    if (settings.enabled) {
      this.startCursorTracking();
    }
  }

  private startCursorTracking() {
    this.cursorTracker.start({
      onPositionChange: (position) => {
        this.overlayManager.updateCursorPosition(position);
      }
    });
    this.overlayManager.start();
    this.overlayManager.updateSettings(this.settingsManager.getSettings());
  }

  private stopCursorTracking() {
    this.cursorTracker.stop();
    this.overlayManager.stop();
  }

  private updateCursorTracking() {
    const settings = this.settingsManager.getSettings();
    this.overlayManager.updateSettings(settings);
  }

  private cleanup() {
    this.stopCursorTracking();
    globalShortcut.unregisterAll();
  }
}

new CursorX().start().catch(console.error);