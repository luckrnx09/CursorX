import { BrowserWindow, screen } from 'electron';
import { join } from 'path';
import { Settings, MousePosition } from '../../shared/types';
import { injectable } from 'inversify';
import { getPreload } from '../utils/getPreload';

@injectable()
export class OverlayManager {
  private overlayWindows: Map<number, BrowserWindow> = new Map();
  private settings: Settings | null = null;
  private isActive = false;

  start() {
    this.isActive = true;
    this.createOverlayWindows();
  }

  stop() {
    this.isActive = false;
    this.destroyOverlayWindows();
  }

  restart() {
    // Force restart to ensure clean state after system wake up
    this.stop();
    this.start();
  }

  updateSettings(settings: Settings) {
    this.settings = settings;
    this.updateOverlayStyles();
  }

  updateCursorPosition(position: MousePosition) {
    if (!this.isActive || !this.settings?.enabled) return;

    this.overlayWindows.forEach((window, displayId) => {
      const display = screen.getAllDisplays().find((d) => d.id === displayId);
      if (!display) return;

      // Check if cursor is on this display
      const { bounds } = display;
      const isOnDisplay =
        position.x >= bounds.x &&
        position.x < bounds.x + bounds.width &&
        position.y >= bounds.y &&
        position.y < bounds.y + bounds.height;

      if (isOnDisplay) {
        window.webContents.send('cursor:position', {
          x: position.x - bounds.x,
          y: position.y - bounds.y,
        });
        window.showInactive();
      } else {
        window.hide();
      }
    });
  }

  private createOverlayWindows() {
    const displays = screen.getAllDisplays();

    displays.forEach((display) => {
      const { bounds } = display;
      const overlayWindow = new BrowserWindow({
        x: bounds.x,
        y: bounds.y,
        width: bounds.width,
        height: bounds.height,
        useContentSize: true,
        transparent: true,
        autoHideMenuBar: true,
        simpleFullscreen: true,
        frame: false,
        alwaysOnTop: true,
        skipTaskbar: true,
        hasShadow: false,
        fullscreenable: true,
        fullscreen: true,
        resizable: false,
        movable: false,
        minimizable: false,
        maximizable: false,
        closable: false,
        focusable: false,
        webPreferences: {
          nodeIntegration: false,
          contextIsolation: true,
          preload: getPreload('overlay'),
        },
      });
      overlayWindow.setAlwaysOnTop(true, 'screen-saver');
      overlayWindow.setVisibleOnAllWorkspaces(true, {
        visibleOnFullScreen: true,
      });
      overlayWindow.setIgnoreMouseEvents(true, { forward: true });

      const isDev = process.env.NODE_ENV === 'development';

      if (isDev) {
        overlayWindow.loadURL('http://localhost:3000/overlay.html');
      } else {
        overlayWindow.loadFile(join(__dirname, '../../renderer/overlay.html'));
      }

      // Send settings once the overlay is ready
      overlayWindow.webContents.once('dom-ready', () => {
        if (this.settings) {
          overlayWindow.webContents.send('settings:update', this.settings);
        }
      });

      this.overlayWindows.set(display.id, overlayWindow);
    });

    // Listen for display changes
    screen.on('display-added', () => this.recreateOverlayWindows());
    screen.on('display-removed', () => this.recreateOverlayWindows());
    screen.on('display-metrics-changed', () => this.recreateOverlayWindows());
  }

  private destroyOverlayWindows() {
    // Remove all display event listeners before destroying windows
    screen.removeAllListeners('display-added');
    screen.removeAllListeners('display-removed');
    screen.removeAllListeners('display-metrics-changed');

    this.overlayWindows.forEach((window) => {
      if (!window.isDestroyed()) {
        try {
          window.destroy();
        } catch (error) {
          console.error('Error destroying overlay window:', error);
        }
      }
    });
    this.overlayWindows.clear();
  }

  private recreateOverlayWindows() {
    this.destroyOverlayWindows();
    if (this.isActive) {
      this.createOverlayWindows();
    }
  }

  private updateOverlayStyles() {
    if (!this.settings) return;

    this.overlayWindows.forEach((window) => {
      window.webContents.send('settings:update', this.settings);
    });
  }
}
