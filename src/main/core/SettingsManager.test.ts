import { describe, expect, it } from "vitest";
import { initializeContainer } from "../container/initializeContainer";
import { DEFAULT_SETTINGS, SettingsManager } from "./SettingsManager";

describe('SettingsManager', () => {
  const container = initializeContainer();
  it('loads default settings', () => {
    const settingsManager = container.get(SettingsManager);
    expect(settingsManager.getSettings()).toEqual(
      DEFAULT_SETTINGS
    );
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
});