Create a cross-platform desktop app in current directory.

## Stack
- Use Electron as the cross-platform framework
- Use TypeScript to make strong code
- Use Solid.js as frontend framework to render the UI to end user
- Use Vite to build the frontend assets
- Use Vitest to write frontend unit tests

## Features
1. Cursor Highlighting
- Displays a customizable highlight effect (such as a colored circle or ripple) around the mouse pointer.
- Helps viewers quickly locate the cursor on the screen.
- The highlight effect should be global, it means that if user can see the system cursor, the cursor effect should appear along with it.

2. Click Visualization
- Shows animated effects (like ripples or flashes) when clicking.
- Can distinguish left-click and right-click with different colors or animations.

3. Personalization Options
- Adjustable cursor size, color, transparency, and animation speed with real time preview.

4. Multi-Monitor Support
- Ensures consistent cursor effects across multiple displays.

5. No Dock Icon
- The app should have a tray icon, dock is not needed
- Tray menu should have three items: Enable/Disable Cursor X, Settings, Quit, About 