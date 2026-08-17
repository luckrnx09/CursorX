import { describe, expect, it, vi } from 'vitest';
import { isNewerVersion, UpdaterService } from './UpdaterService';

describe('isNewerVersion', () => {
  it('detects a newer patch version', () => {
    expect(isNewerVersion('0.0.7', '0.0.6')).toBe(true);
  });

  it('detects a newer minor version', () => {
    expect(isNewerVersion('0.1.0', '0.0.9')).toBe(true);
  });

  it('detects a newer major version', () => {
    expect(isNewerVersion('1.0.0', '0.9.9')).toBe(true);
  });

  it('strips the v prefix', () => {
    expect(isNewerVersion('v0.0.7', '0.0.6')).toBe(true);
  });

  it('ignores prerelease suffixes', () => {
    expect(isNewerVersion('0.0.7-beta.1', '0.0.6')).toBe(true);
  });

  it('returns false for the same version', () => {
    expect(isNewerVersion('0.0.6', '0.0.6')).toBe(false);
  });

  it('returns false for an older version', () => {
    expect(isNewerVersion('0.0.5', '0.0.6')).toBe(false);
  });
});

describe('UpdaterService', () => {
  it('emits an error status when checking updates in a dev build', async () => {
    const service = new UpdaterService();
    const statuses: unknown[] = [];
    const win = {
      isDestroyed: () => false,
      webContents: { send: (_channel: string, status: unknown) => statuses.push(status) },
    };
    service.init(() => win as never);
    await service.check();
    expect(statuses).toEqual([
      { state: 'error', message: 'Updates are only available in packaged builds' },
    ]);
  });

  it('does not emit when the settings window is destroyed', async () => {
    const service = new UpdaterService();
    const send = vi.fn();
    const win = { isDestroyed: () => true, webContents: { send } };
    service.init(() => win as never);
    await service.check();
    expect(send).not.toHaveBeenCalled();
  });
});
