import { app, net, BrowserWindow } from 'electron';
import type { AppUpdater } from 'electron-updater';
import { once } from 'events';
import { createWriteStream } from 'fs';
import { join } from 'path';
import { UpdateStatus } from '../../shared/types';
import { installMacUpdate } from './installMacUpdate';

const LATEST_RELEASE_URL = 'https://github.com/luckrnx09/CursorX/releases/latest';
const RELEASE_DOWNLOAD_BASE = 'https://github.com/luckrnx09/CursorX/releases/download';
const VERSION_PART_COUNT = 3;
const DOWNLOAD_PERCENT_CAP = 99;

export const isNewerVersion = (latest: string, current: string): boolean => {
  const parse = (v: string) => v.replace(/^v/, '').split('-')[0].split('.').map(Number);
  const [a, b] = [parse(latest), parse(current)];
  for (let i = 0; i < VERSION_PART_COUNT; i += 1) {
    if ((a[i] ?? 0) !== (b[i] ?? 0)) return (a[i] ?? 0) > (b[i] ?? 0);
  }
  return false;
};

const resolveLatestTag = (): Promise<string> =>
  new Promise((resolve, reject) => {
    const request = net.request({ method: 'HEAD', url: LATEST_RELEASE_URL });
    request.on('redirect', (_statusCode, _method, redirectUrl) => {
      request.abort();
      resolve(redirectUrl.split('/').pop() ?? '');
    });
    request.on('response', (response) => {
      reject(new Error(`Release check failed: HTTP ${response.statusCode}`));
    });
    request.on('error', reject);
    request.end();
  });

export class UpdaterService {
  private autoUpdater: AppUpdater | null = null;
  private getSettingsWindow: (() => BrowserWindow | null) | null = null;
  private macDmgUrl: string | null = null;
  private macVersion: string | null = null;

  init(getSettingsWindow: () => BrowserWindow | null): void {
    this.getSettingsWindow = getSettingsWindow;
    if (!app.isPackaged) {
      return;
    }
    if (process.platform !== 'darwin') {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { autoUpdater } = require('electron-updater') as typeof import('electron-updater');
      this.autoUpdater = autoUpdater;
      autoUpdater.on('update-available', (info) =>
        this.emit({ state: 'available', version: info.version })
      );
      autoUpdater.on('update-not-available', () => this.emit({ state: 'not-available' }));
      autoUpdater.on('update-downloaded', (info) =>
        this.emit({ state: 'downloaded', version: info.version })
      );
      autoUpdater.on('error', (err) => {
        console.warn('Auto update error', err);
        this.emit({ state: 'error', message: String(err) });
      });
    }
    void this.check();
  }

  async check(): Promise<void> {
    if (!app.isPackaged) {
      this.emit({ state: 'error', message: 'Updates are only available in packaged builds' });
      return;
    }
    this.emit({ state: 'checking' });
    if (this.autoUpdater) {
      try {
        await this.autoUpdater.checkForUpdates();
      } catch {
        // electron-updater already emitted an 'error' event with the status
      }
      return;
    }
    await this.checkMacManually();
  }

  quitAndInstall(): void {
    this.autoUpdater?.quitAndInstall();
  }

  installUpdate(): void {
    if (process.platform !== 'darwin') return;
    void this.downloadAndInstallMac();
  }

  private async checkMacManually(): Promise<void> {
    try {
      const tag = await resolveLatestTag();
      const latest = tag.replace(/^v/, '');
      if (!latest || !isNewerVersion(latest, app.getVersion())) {
        this.emit({ state: 'not-available' });
        return;
      }
      const suffix = process.arch === 'arm64' ? '-arm64' : '';
      this.macDmgUrl = `${RELEASE_DOWNLOAD_BASE}/${tag}/CursorX-${latest}${suffix}.dmg`;
      this.macVersion = latest;
      this.emit({ state: 'available', version: latest });
    } catch (err) {
      console.warn('Manual update check failed', err);
      this.emit({ state: 'error', message: String(err) });
    }
  }

  private async downloadAndInstallMac(): Promise<void> {
    const url = this.macDmgUrl;
    const version = this.macVersion;
    if (!url || !version) return;
    const target = join(app.getPath('temp'), `CursorX-${version}.dmg`);
    try {
      const response = await net.fetch(url);
      if (!response.ok || !response.body) {
        throw new Error(`Download failed: HTTP ${response.status}`);
      }
      const total = Number(response.headers.get('content-length') ?? 0);
      const reader = response.body.getReader();
      const file = createWriteStream(target);
      let received = 0;
      let lastPercent = -1;
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        if (!file.write(value)) {
          await once(file, 'drain');
        }
        received += value.byteLength;
        if (total > 0) {
          const percent = Math.min(DOWNLOAD_PERCENT_CAP, Math.round((received / total) * 100));
          if (percent !== lastPercent) {
            lastPercent = percent;
            this.emit({ state: 'downloading', percent });
          }
        }
      }
      await new Promise<void>((resolve, reject) => {
        file.once('error', reject);
        file.end(resolve);
      });
      this.emit({ state: 'downloaded', version });
      installMacUpdate(target);
    } catch (err) {
      console.warn('macOS update download failed', err);
      this.emit({ state: 'error', message: String(err) });
    }
  }

  private emit(status: UpdateStatus): void {
    const win = this.getSettingsWindow?.();
    if (win && !win.isDestroyed()) {
      win.webContents.send('update:status', status);
    }
  }
}
