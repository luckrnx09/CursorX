# CursorX — Modern Cross-Platform Cursor Highlighting

Electron + React + TypeScript + Vite desktop app. It draws a highlight circle
under the mouse cursor on any screen, with background fill and animated outline.

## Tech Stack
- **Runtime:** Electron (main + renderer process)
- **Renderer:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS v4 + shadcn/ui components
- **DI:** InversifyJS for main-process IoC container
- **Build:** tsc (main), Vite (renderer), electron-builder (packaging)
- **Test:** Vitest

## Architecture

```
CursorX (main/main.ts)        ← app lifecycle, tray, IPC
├── SettingsManager           ← load/save settings.json via Electron userData
├── CursorTracker             ← polls cursor at ~60fps, calls onPositionChange
├── OverlayManager            ← manages transparent BrowserWindows per display
│
├── preload/settings.ts       ← contextBridge for settings window
└── preload/overlay.ts        ← contextBridge for overlay windows
```

### Data flow: cursor highlight

1. `CursorTracker.start()` polls `getCursorScreenPoint()` every 16ms
2. On change → calls `OverlayManager.updateCursorPosition(position)`
3. `OverlayManager` sends `cursor:position` IPC to the overlay window on the correct display
4. Overlay renderer (`OverlayLayout`) receives position → passes to `CursorHighlight` component
5. `CursorHighlight` renders a `<div>` with background color + `OutlineEffect` (CSS animation)

### Data flow: settings

1. Settings window renders `SettingsPanel` → uses shadcn `<Slider>`, `<Switch>`, `<Input>`
2. Changes call `window.settingsAPI.settings.set(settings)` → IPC `settings:set`
3. Main process `SettingsManager.updateSettings(settings)` writes `settings.json`
4. `OverlayManager.updateSettings(settings)` sends `settings:update` IPC to all overlay windows

### Key types (`src/shared/types.ts`)
- `Settings { enabled, size, background: {color, opacity}, outline: {color, opacity, offset, width} }`
- `MousePosition { x, y }`

## File Map

| Path | Purpose |
|------|---------|
| `src/main/main.ts` | Electron app entry: tray, IPC handlers, lifecycle |
| `src/main/core/SettingsManager.ts` | Read/write settings JSON, DEFAULT_SETTINGS |
| `src/main/core/CursorTracker.ts` | 60fps cursor position polling loop |
| `src/main/core/OverlayManager.ts` | Create/destroy transparent fullscreen overlay windows per display |
| `src/shared/types.ts` | `Settings` and `MousePosition` interfaces shared between main+renderer |
| `src/renderer/views/SettingsApp.tsx` | Settings page top-level layout |
| `src/renderer/components/SettingsPanel.tsx` | Settings form: sliders, switches, color pickers |
| `src/renderer/layouts/OverlayLayout.tsx` | Overlay root: listens to IPC, renders `CursorHighlight` |
| `src/renderer/components/CursorHighlight.tsx` | The highlight circle + `OutlineEffect` |
| `src/main/core/UpdaterService.ts` | Auto-update: electron-updater on Win/Linux, manual dmg swap on macOS |
| `resources/scripts/update-mac.sh` | Detached script that swaps the .app bundle and relaunches on macOS |
| `src/renderer/components/UpdateSection.tsx` | Settings page update card: version, status, install actions |
| `src/renderer/components/OutlineEffect.tsx` | CSS-animated pulsing outline ring |
| `src/renderer/components/ui/slider.tsx` | shadcn slider (already available) |
| `src/renderer/components/ui/switch.tsx` | shadcn switch |
| `src/renderer/components/ui/card.tsx` | shadcn card |
| `src/main/preload/settings.ts` | contextBridge API for settings window |
| `src/main/preload/overlay.ts` | contextBridge API for overlay window |

## Commands

```bash
npm run dev             # dev: Vite + tsc watch + Electron
npm run build           # production build
npm run test            # vitest run
npm run lint:all        # eslint fix + prettier format
npm run package         # electron-builder
```
