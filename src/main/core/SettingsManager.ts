import { app } from "electron";
import { join } from "path";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { Settings } from "../../shared/types";
import { injectable } from "inversify";

export const DEFAULT_SETTINGS: Settings = {
  enabled: true,
  size: 80,
  background: {
    color: "#13bef6",
    opacity: 0.5,
  },
  outline: {
    offset: 2,
    width: 5,
    color: "#00FF00",
    opacity: 0.5,
  },
}

@injectable()
export class SettingsManager {
  private settingsPath: string;
  private settings: Settings = DEFAULT_SETTINGS;

  constructor() {
    const userDataPath = app.getPath("userData");
    if (!existsSync(userDataPath)) {
      mkdirSync(userDataPath, { recursive: true });
    }
    this.settingsPath = join(userDataPath, "settings.json");
    this.initializeSettings();
  }

  private initializeSettings() {
    if (!existsSync(this.settingsPath)) {
      this.updateSettings(DEFAULT_SETTINGS);
    }
    try {
      const settingsData = readFileSync(this.settingsPath, "utf-8");
      const settings = JSON.parse(settingsData) as Settings;
      this.settings = { ...DEFAULT_SETTINGS, ...settings };
    } catch (error) {
      console.warn("Failed to load settings, using defaults:", error);
      this.settings = DEFAULT_SETTINGS;
    }
  }

  getSettings(): Settings {
    return Object.freeze({ ...this.settings });
  }

  updateSettings(settings: Settings): void {
    this.settings = settings;
    try {
      writeFileSync(this.settingsPath, JSON.stringify(settings, null, 2));
    } catch (error) {
      console.error("Failed to save settings:", error);
    }
  }

  reset(): void {
    this.updateSettings(DEFAULT_SETTINGS);
  }
}
