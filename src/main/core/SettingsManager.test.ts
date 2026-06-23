import { describe, expect, it } from 'vitest';
import { initializeContainer } from '../container/initializeContainer';
import { DEFAULT_SETTINGS, SettingsManager } from './SettingsManager';

describe('SettingsManager', () => {
  const container = initializeContainer();
  it('loads default settings', () => {
    const settingsManager = container.get(SettingsManager);
    expect(settingsManager.getSettings()).toEqual(DEFAULT_SETTINGS);
  });

  it('updates settings', () => {
    const settingsManager = container.get(SettingsManager);
    const settings = settingsManager.getSettings();
    settingsManager.updateSettings({ ...settings, background: { color: 'red', opacity: 0.5 } });
    expect(settingsManager.getSettings()).toEqual(
      expect.objectContaining({ background: { color: 'red', opacity: 0.5 } })
    );
  });

  it('resets settings to default', () => {
    const settingsManager = container.get(SettingsManager);
    settingsManager.reset();
    expect(settingsManager.getSettings()).toEqual(DEFAULT_SETTINGS);
  });

  describe('hiddenAfterMs', () => {
    const nestedContainer = initializeContainer();

    it('DEFAULT_SETTINGS includes hiddenAfterMs', () => {
      expect(DEFAULT_SETTINGS.hiddenAfterMs).toBe(5);
    });

    it('defaults to 5 seconds', () => {
      const settingsManager = nestedContainer.get(SettingsManager);
      settingsManager.reset();
      expect(settingsManager.getSettings().hiddenAfterMs).toBe(5);
    });

    it('can be set to 0 (always show)', () => {
      const settingsManager = nestedContainer.get(SettingsManager);
      const settings = settingsManager.getSettings();
      settingsManager.updateSettings({ ...settings, hiddenAfterMs: 0 });
      expect(settingsManager.getSettings().hiddenAfterMs).toBe(0);
      // Clean up to avoid contaminating other tests
      settingsManager.reset();
    });

    it('can be set to 10 (max delay)', () => {
      const settingsManager = nestedContainer.get(SettingsManager);
      const settings = settingsManager.getSettings();
      settingsManager.updateSettings({ ...settings, hiddenAfterMs: 10 });
      expect(settingsManager.getSettings().hiddenAfterMs).toBe(10);
      // Clean up to avoid contaminating other tests
      settingsManager.reset();
    });
  });
});
