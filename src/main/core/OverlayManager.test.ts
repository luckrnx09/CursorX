import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { initializeContainer } from "../container/initializeContainer";
import { OverlayManager } from "./OverlayManager";
import { BrowserWindow, screen } from "electron";
import { Settings, MousePosition,  } from "../../shared/types";

vi.mock("../utils/getPreload", () => ({
  getPreload: vi.fn(() => "/mocked/preload/path.js"),
}));

vi.mock("electron", async () => {
  const actual = await vi.importActual("electron");
  
  const mockBrowserWindow = vi.fn().mockImplementation(() => ({
    webContents: {
      send: vi.fn(),
      once: vi.fn((event: string, callback: () => void) => {
        if (event === "dom-ready") {
          setTimeout(callback, 0);
        }
      }),
    },
    setAlwaysOnTop: vi.fn(),
    setVisibleOnAllWorkspaces: vi.fn(),
    setIgnoreMouseEvents: vi.fn(),
    loadURL: vi.fn(),
    loadFile: vi.fn(),
    showInactive: vi.fn(),
    hide: vi.fn(),
    isDestroyed: vi.fn().mockReturnValue(false),
    destroy: vi.fn(),
  }));

  const mockScreen = {
    getAllDisplays: vi.fn(() => [
      {
        id: 1,
        bounds: { x: 0, y: 0, width: 1920, height: 1080 },
      },
      {
        id: 2,
        bounds: { x: 1920, y: 0, width: 1920, height: 1080 },
      },
    ]),
    on: vi.fn(),
  };

  return {
    ...actual,
    BrowserWindow: mockBrowserWindow,
    screen: mockScreen,
  };
});

describe("OverlayManager", () => {
  let overlayManager: OverlayManager;
  let mockSettings: Settings;

  beforeEach(() => {
    vi.clearAllMocks();
    const container = initializeContainer();
    overlayManager = container.get(OverlayManager);
    
    mockSettings = {
      enabled: true,
      size: 30,
      background: {
        color: "#000000",
        opacity: 0.5,
      },
      outline: {
        offset: 2,
        width: 8, 
        color: "#00FF00",
        opacity: 0.7,
      },
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("start", () => {
    it("creates overlay windows for all displays", () => {
      overlayManager.start();
      
      expect(BrowserWindow).toHaveBeenCalledTimes(2);
    });

    it("creates overlay window with correct configuration", () => {
      overlayManager.start();

      expect(BrowserWindow).toHaveBeenCalledWith(
        expect.objectContaining({
          x: 0,
          y: 0,
          width: 1920,
          height: 1080,
          transparent: true,
          frame: false,
          alwaysOnTop: true,
          skipTaskbar: true,
          focusable: false,
        })
      );
    });

    it("sets up display event listeners", () => {
      overlayManager.start();

      expect(screen.on).toHaveBeenCalledWith("display-added", expect.any(Function));
      expect(screen.on).toHaveBeenCalledWith("display-removed", expect.any(Function));
      expect(screen.on).toHaveBeenCalledWith("display-metrics-changed", expect.any(Function));
    });
  });

  describe("stop", () => {
    it("destroys all overlay windows", () => {
      overlayManager.start();
      
      const browserWindowInstances = vi.mocked(BrowserWindow).mock.results;
      
      overlayManager.stop();

      browserWindowInstances.forEach((result) => {
        expect(result.value.destroy).toHaveBeenCalled();
      });
    });

    it("does not destroy already destroyed windows", () => {
      overlayManager.start();
      
      const browserWindowInstances = vi.mocked(BrowserWindow).mock.results;
      browserWindowInstances[0].value.isDestroyed = vi.fn().mockReturnValue(true);

      overlayManager.stop();

      expect(browserWindowInstances[0].value.destroy).not.toHaveBeenCalled();
      expect(browserWindowInstances[1].value.destroy).toHaveBeenCalled();
    });
  });

  describe("updateSettings", () => {
    it("sends settings to all overlay windows", async () => {
      overlayManager.start();
      
      // Wait for dom-ready callbacks
      await new Promise(resolve => setTimeout(resolve, 10));
      
      const browserWindowInstances = vi.mocked(BrowserWindow).mock.results;
      
      overlayManager.updateSettings(mockSettings);

      browserWindowInstances.forEach((result) => {
        expect(result.value.webContents.send).toHaveBeenCalledWith(
          "settings:update",
          mockSettings
        );
      });
    });

    it("sends initial settings when overlay is ready", async () => {
      overlayManager.updateSettings(mockSettings);
      overlayManager.start();

      // Wait for dom-ready callbacks
      await new Promise(resolve => setTimeout(resolve, 10));

      const browserWindowInstances = vi.mocked(BrowserWindow).mock.results;
      
      browserWindowInstances.forEach((result) => {
        expect(result.value.webContents.send).toHaveBeenCalledWith(
          "settings:update",
          mockSettings
        );
      });
    });
  });

  describe("updateCursorPosition", () => {
    beforeEach(() => {
      overlayManager.start();
      overlayManager.updateSettings(mockSettings);
    });

    it("updates cursor position on correct display", () => {
      const position: MousePosition = { x: 100, y: 100 };
      
      overlayManager.updateCursorPosition(position);

      const browserWindowInstances = vi.mocked(BrowserWindow).mock.results;
      
      expect(browserWindowInstances[0].value.webContents.send).toHaveBeenCalledWith(
        "cursor:position",
        { x: 100, y: 100 }
      );
      expect(browserWindowInstances[0].value.showInactive).toHaveBeenCalled();
      expect(browserWindowInstances[1].value.hide).toHaveBeenCalled();
    });

    it("updates cursor position on second display", () => {
      const position: MousePosition = { x: 2000, y: 100 };
      
      overlayManager.updateCursorPosition(position);

      const browserWindowInstances = vi.mocked(BrowserWindow).mock.results;
      
      expect(browserWindowInstances[1].value.webContents.send).toHaveBeenCalledWith(
        "cursor:position",
        { x: 80, y: 100 } // x: 2000 - 1920 = 80
      );
      expect(browserWindowInstances[1].value.showInactive).toHaveBeenCalled();
      expect(browserWindowInstances[0].value.hide).toHaveBeenCalled();
    });

    it("does not update when not active", () => {
      overlayManager.stop();
      
      const position: MousePosition = { x: 100, y: 100 };
      overlayManager.updateCursorPosition(position);

      const browserWindowInstances = vi.mocked(BrowserWindow).mock.results;
      
      expect(browserWindowInstances[0].value.webContents.send).not.toHaveBeenCalledWith(
        "cursor:position",
        expect.anything()
      );
    });

    it("does not update when settings disabled", () => {
      overlayManager.updateSettings({ ...mockSettings, enabled: false });
      
      const position: MousePosition = { x: 100, y: 100 };
      overlayManager.updateCursorPosition(position);

      const browserWindowInstances = vi.mocked(BrowserWindow).mock.results;
      
      const cursorPositionCalls = browserWindowInstances[0].value.webContents.send.mock.calls
        .filter((call: any[]) => call[0] === "cursor:position");
      
      expect(cursorPositionCalls).toHaveLength(0);
    });
  });

  describe("display changes", () => {
    it("recreates overlay windows when display is added", () => {
      overlayManager.start();
      
      expect(BrowserWindow).toHaveBeenCalledTimes(2);
      
      // Get the display-added callback
      const screenOnCalls = vi.mocked(screen.on).mock.calls as Array<[string, () => void]>;
      const displayAddedCall = screenOnCalls.find(
        (call) => call[0] === "display-added"
      );
      const displayAddedCallback = displayAddedCall![1] as () => void;
      
      // Trigger display-added event
      displayAddedCallback();
      
      // Should create new windows (2 initial + 2 recreated = 4)
      expect(BrowserWindow).toHaveBeenCalledTimes(4);
    });

    it("recreates overlay windows when display is removed", () => {
      overlayManager.start();
      
      expect(BrowserWindow).toHaveBeenCalledTimes(2);
      
      const screenOnCalls = vi.mocked(screen.on).mock.calls as Array<[string, () => void]>;
      const displayRemovedCall = screenOnCalls.find(
        (call) => call[0] === "display-removed"
      );
      const displayRemovedCallback = displayRemovedCall![1] as () => void;
      
      displayRemovedCallback();
      
      expect(BrowserWindow).toHaveBeenCalledTimes(4);
    });

    it("recreates overlay windows when display metrics change", () => {
      overlayManager.start();
      
      expect(BrowserWindow).toHaveBeenCalledTimes(2);
      
      const screenOnCalls = vi.mocked(screen.on).mock.calls as Array<[string, () => void]>;
      const metricsChangedCall = screenOnCalls.find(
        (call) => call[0] === "display-metrics-changed"
      );
      const metricsChangedCallback = metricsChangedCall![1] as () => void;
      
      metricsChangedCallback();
      
      expect(BrowserWindow).toHaveBeenCalledTimes(4);
    });
  });
});
