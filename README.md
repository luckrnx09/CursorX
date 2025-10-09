<div align="center">
  <img src="screenshots/CursorX.png" alt="CursorX Screenshot" width="800">
  
  # CursorX
  
  **A modern cross-platform desktop app for cursor highlighting and click visualization**
  
  [![CI](https://github.com/luckrnx09/CursorX/workflows/CI/badge.svg)](https://github.com/luckrnx09/CursorX/actions/workflows/ci.yml)
  [![Release](https://github.com/luckrnx09/CursorX/actions/workflows/release.yml/badge.svg)](https://github.com/luckrnx09/CursorX/actions/workflows/release.yml)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  
  [Download](#-download--installation) • [Features](#-features) • [Documentation](#-documentation) • [Contributing](#-contributing)
</div>

---

## 🎯 About

CursorX is a powerful yet lightweight desktop application that enhances your screen recordings, presentations, and tutorials by providing real-time cursor highlighting and click visualization. Built with modern technologies, it runs seamlessly on macOS, Windows, and Linux.

Perfect for:
- 📹 **Content Creators** - Make your tutorials more engaging
- 👨‍🏫 **Educators** - Help students follow along with demonstrations
- 💼 **Presenters** - Keep your audience focused during presentations
- 🎥 **Screen Recorders** - Add professional cursor effects to your videos

---

## 📥 Download & Installation

### Latest Release (v1.0.0)

Download the installer for your operating system:

| Platform | Download | Size |
|----------|----------|------|
| 🍎 **macOS** (Apple Silicon) | [CursorX-1.0.0-arm64.dmg](https://github.com/luckrnx09/CursorX/releases/latest/download/CursorX-1.0.0-arm64.dmg) | ~150 MB |
| 🪟 **Windows** | [CursorX Setup 1.0.0.exe](https://github.com/luckrnx09/CursorX/releases/latest/download/CursorX.Setup.1.0.0.exe) | ~130 MB |
| 🐧 **Linux** (ARM64) | [CursorX-1.0.0-arm64.AppImage](https://github.com/luckrnx09/CursorX/releases/latest/download/CursorX-1.0.0-arm64.AppImage) | ~140 MB |

### Installation Instructions

#### macOS
1. Download the `.dmg` file
2. Open the downloaded file
3. Drag **CursorX** to your Applications folder
4. Launch CursorX from Applications
5. If prompted, allow CursorX in System Preferences → Security & Privacy

#### Windows
1. Download the `.exe` installer
2. Run the installer
3. Follow the installation wizard
4. Launch CursorX from the Start Menu or Desktop shortcut

#### Linux
1. Download the `.AppImage` file
2. Make it executable: `chmod +x CursorX-1.0.0-arm64.AppImage`
3. Run the application: `./CursorX-1.0.0-arm64.AppImage`

---

## ✨ Features

### 🎨 Customizable Cursor Highlighting
- **Adjustable Size** - Choose the perfect highlight circle size for your needs
- **Custom Colors** - Pick any color for the cursor highlight background and outline
- **Opacity Control** - Fine-tune transparency levels for subtle or bold effects
- **Outline Customization** - Adjust outline width, offset, and appearance

### 🖱️ Click Visualization
- Real-time visual feedback when you click
- Smooth animations that don't distract from your content
- Works across all applications and windows

### ⚙️ Easy Configuration
- **System Tray Integration** - Quick access from your menu bar/system tray
- **Instant Toggle** - Enable/disable CursorX with a single click
- **Settings Panel** - User-friendly interface for all customization options
- **Start at Login** - Automatically launch CursorX when your system starts

### 🌍 Cross-Platform Support
- Built with Electron for consistent experience across platforms
- Native look and feel on macOS, Windows, and Linux
- Optimized performance on all supported systems

### 🔒 Privacy First
- Runs completely locally on your machine
- No data collection or telemetry
- No internet connection required

---

## 🛠️ Tech Stack

CursorX is built with modern, robust technologies:

### Core Technologies
- **[Electron](https://www.electronjs.org/)** (v30.0.0) - Cross-platform desktop framework
- **[TypeScript](https://www.typescriptlang.org/)** (v5.5.0) - Type-safe development
- **[React](https://react.dev/)** (v19.0.0) - UI framework
- **[Vite](https://vitejs.dev/)** (v5.3.0) - Fast build tool and dev server

### UI & Styling
- **[Tailwind CSS](https://tailwindcss.com/)** (v4.1.14) - Utility-first CSS framework
- **[Radix UI](https://www.radix-ui.com/)** - Accessible UI components
- **[Lucide React](https://lucide.dev/)** - Beautiful icon library
- **[shadcn/ui](https://ui.shadcn.com/)** - High-quality UI components

### Architecture & Patterns
- **[InversifyJS](https://inversify.io/)** (v7.9.0) - Dependency injection container
- **[Reflect Metadata](https://www.npmjs.com/package/reflect-metadata)** - Decorator support
- Clean architecture with separation of concerns

### Development Tools
- **[Vitest](https://vitest.dev/)** (v3.2.4) - Fast unit testing
- **[ESLint](https://eslint.org/)** (v8.57.0) - Code linting
- **[Prettier](https://prettier.io/)** (v3.6.2) - Code formatting
- **[Electron Builder](https://www.electron.build/)** (v24.13.0) - Application packaging

---

## 🚀 Development

### Prerequisites

- **Node.js** v20.x or higher
- **npm** v9.x or higher
- **Git**

### Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/luckrnx09/CursorX.git
   cd CursorX
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development mode**
   ```bash
   npm run dev
   ```
   This will start both the Vite dev server and Electron in development mode.

### Available Scripts

#### Development
```bash
npm run dev              # Start full development mode
npm run dev:renderer     # Start Vite dev server only
npm run dev:main         # Start Electron main process only
```

#### Quality Checks
```bash
npm run lint             # Check for linting issues
npm run lint:fix         # Fix linting issues automatically
npm run format           # Format code with Prettier
npm run format:check     # Check code formatting
npm run lint:all         # Fix linting + format (recommended before commit)
```

#### Testing
```bash
npm run test             # Run all tests
npm run test:ui          # Run tests with UI
```

#### Building
```bash
npm run build            # Build for production
npm run build:renderer   # Build Vite app only
npm run build:main       # Compile TypeScript only
```

#### Packaging
```bash
npm run package          # Package for current platform
npm run package:mac      # Package for macOS
npm run package:win      # Package for Windows
npm run package:linux    # Package for Linux
npm run package:all      # Package for all platforms
```

### Project Structure

```
CursorX/
├── src/
│   ├── main/                 # Electron main process
│   │   ├── main.ts          # Application entry point
│   │   ├── core/            # Core functionality
│   │   │   ├── CursorTracker.ts      # Cursor position tracking
│   │   │   ├── OverlayManager.ts     # Overlay window management
│   │   │   └── SettingsManager.ts    # Settings persistence
│   │   ├── container/       # Dependency injection setup
│   │   ├── preload/         # Preload scripts for IPC
│   │   ├── utils/           # Utility functions
│   │   └── assets/          # Static assets (icons, etc.)
│   │
│   ├── renderer/            # React UI application
│   │   ├── overlay.html     # Overlay window HTML
│   │   ├── settings.html    # Settings window HTML
│   │   ├── components/      # React components
│   │   ├── entrypoints/     # Application entry points
│   │   ├── views/           # Page views
│   │   └── styles/          # Global styles
│   │
│   └── shared/              # Shared types and interfaces
│       └── types.ts
│
├── release/                 # Built application packages
├── dist/                    # Compiled code (generated)
├── .github/workflows/       # CI/CD workflows
└── scripts/                 # Build and release scripts
```

### Architecture Overview

CursorX follows a clean architecture pattern with clear separation of concerns:

1. **Main Process** - Handles system integration, cursor tracking, and overlay management
2. **Renderer Process** - Provides the user interface for settings and overlay rendering
3. **IPC Communication** - Secure communication between main and renderer processes
4. **Dependency Injection** - InversifyJS container for managing dependencies

Key Components:
- **CursorTracker** - Monitors cursor position system-wide
- **OverlayManager** - Creates and manages transparent overlay windows
- **SettingsManager** - Persists user preferences across sessions

---

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Ways to Contribute

1. 🐛 **Report Bugs** - Found a bug? [Open an issue](https://github.com/luckrnx09/CursorX/issues)
2. 💡 **Suggest Features** - Have an idea? We'd love to hear it!
3. 📖 **Improve Documentation** - Help others understand the project
4. 🔧 **Submit Pull Requests** - Fix bugs or add features

### Contribution Workflow

1. **Fork the repository**
   ```bash
   gh repo fork luckrnx09/CursorX --clone
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Write clear, commented code
   - Follow existing code style
   - Add tests for new features

4. **Test your changes**
   ```bash
   npm run lint:all      # Fix linting and formatting
   npm run test          # Run tests
   npm run build         # Verify build works
   ```

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```
   
   We follow [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation changes
   - `style:` - Code style changes (formatting)
   - `refactor:` - Code refactoring
   - `test:` - Test additions or changes
   - `chore:` - Build process or auxiliary tool changes

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

7. **Create a Pull Request**
   - Go to the [original repository](https://github.com/luckrnx09/CursorX)
   - Click "New Pull Request"
   - Select your fork and branch
   - Provide a clear description of your changes

### Development Guidelines

- **Code Quality**: Maintain high code quality with proper typing and error handling
- **Testing**: Add tests for new features and bug fixes
- **Documentation**: Update documentation for API changes
- **Performance**: Consider performance implications of your changes
- **Accessibility**: Ensure UI changes are accessible

---

## 📚 Documentation

### Additional Resources

- [Workflows Overview](WORKFLOWS_OVERVIEW.md) - CI/CD pipeline documentation
- [Release Guide](scripts/release.sh) - How to create releases
- [GitHub Actions](.github/workflows/) - Automated workflows

### API Documentation

For developers integrating with CursorX or extending its functionality, refer to the TypeScript definitions in [`src/shared/types.ts`](src/shared/types.ts).

---

## 🐛 Known Issues

- macOS Sonoma and later may require additional accessibility permissions
- Some Linux distributions may need additional dependencies for transparency effects

For a complete list of issues and upcoming features, check our [GitHub Issues](https://github.com/luckrnx09/CursorX/issues).

---

## 📄 License

CursorX is open source software licensed under the [MIT License](LICENSE).

```
MIT License

Copyright (c) 2025 CursorX Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🙏 Acknowledgments

- Built with [Electron](https://www.electronjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Inspired by the need for better screen recording tools

---

## 🌟 Support

If you find CursorX useful, please consider:

- ⭐ **Star this repository** to show your support
- 🐛 **Report bugs** to help us improve
- 💬 **Share feedback** on what features you'd like to see
- 📢 **Spread the word** to others who might find it useful

---

## 📧 Contact

- **GitHub**: [@luckrnx09](https://github.com/luckrnx09)
- **Repository**: [luckrnx09/CursorX](https://github.com/luckrnx09/CursorX)
- **Issues**: [Report a bug](https://github.com/luckrnx09/CursorX/issues/new)

---

<div align="center">
  <p>Made with ❤️ by the CursorX Team</p>
  <p>
    <a href="https://github.com/luckrnx09/CursorX">⭐ Star on GitHub</a> •
    <a href="https://github.com/luckrnx09/CursorX/issues">🐛 Report Bug</a> •
    <a href="https://github.com/luckrnx09/CursorX/issues">💡 Request Feature</a>
  </p>
</div>
