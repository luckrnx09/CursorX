# GitHub Workflows Overview

## 📊 Workflow Summary

Your CursorX project now has **two automated workflows**:

### 1. CI Workflow (`ci.yml`)
**Trigger**: Every commit to any branch  
**Purpose**: Continuous integration and quality checks  
**Duration**: ~5-10 minutes

### 2. Release Workflow (`release.yml`)
**Trigger**: Version tags (e.g., `v1.0.0`)  
**Purpose**: Build and publish releases  
**Duration**: ~10-20 minutes

## 🔄 Complete Development Flow

```
┌─────────────────────────────────────────────────────────────────┐
│  Developer Workflow                                             │
└─────────────────────────────────────────────────────────────────┘

1. 💻 Write Code
   │
   ├─ Make changes
   ├─ Add features
   └─ Fix bugs
   │
   ▼

2. 🔍 Local Testing
   │
   ├─ npm run lint:all    (fix & format)
   ├─ npm run test        (run tests)
   └─ npm run build       (verify build)
   │
   ▼

3. 📤 Push to GitHub
   │
   ├─ git add .
   ├─ git commit -m "feat: new feature"
   └─ git push origin main
   │
   ▼

4. ✅ CI Workflow Runs (Automatic)
   │
   ├─ ✓ Check linting & formatting
   ├─ ✓ Run tests
   ├─ ✓ Build app for all platforms
   └─ ✓ Upload artifacts (7 days)
   │
   ▼

5. 🎯 When Ready to Release
   │
   └─ ./scripts/release.sh 1.0.1
   │
   ▼

6. 🚀 Release Workflow Runs (Automatic)
   │
   ├─ ✓ Run tests
   ├─ ✓ Build macOS installer (.dmg)
   ├─ ✓ Build Windows installer (.exe)
   ├─ ✓ Build Linux installer (.AppImage)
   └─ ✓ Create GitHub release with all files
   │
   ▼

7. 🎉 Users Download
   │
   └─ https://github.com/luckrnx09/CursorX/releases
```

## 📋 Workflow Comparison

| Feature | CI Workflow | Release Workflow |
|---------|-------------|------------------|
| **Triggered by** | Every commit | Version tags only |
| **Runs on** | All branches | Tags like `v*.*.*` |
| **Purpose** | Quality checks | Production releases |
| **Platforms** | 3 (Ubuntu, macOS, Windows) | 3 (Ubuntu, macOS, Windows) |
| **Tests** | ✅ Yes | ✅ Yes |
| **Linting** | ✅ Yes | ❌ No (assumed done) |
| **Build** | ✅ Yes | ✅ Yes |
| **Artifacts** | 7 days | Permanent |
| **GitHub Release** | ❌ No | ✅ Yes |
| **User downloads** | ❌ No | ✅ Yes |

## 🎯 When Each Workflow Runs

### CI Workflow Examples
```bash
# These trigger CI workflow:
git push origin main
git push origin feature/new-ui
git push origin bugfix/crash

# Pull requests also trigger it:
Create PR → CI runs automatically
```

### Release Workflow Examples
```bash
# These trigger Release workflow:
git tag v1.0.0 && git push origin v1.0.0
git tag v1.0.1 && git push origin v1.0.1
git tag v2.0.0-beta.1 && git push origin v2.0.0-beta.1

# Regular commits do NOT trigger it:
git push origin main  # ❌ Release won't run
```

## 🔧 NPM Scripts Reference

### Development
```bash
npm run dev              # Start development mode
npm run dev:renderer     # Start Vite dev server
npm run dev:main         # Start Electron main process
```

### Quality Checks
```bash
npm run lint            # Check linting (no fixes)
npm run lint:fix        # Fix linting issues
npm run format          # Format all code
npm run format:check    # Check formatting (no changes)
npm run lint:all        # Fix linting + format (use before commit)
npm run lint:check      # Check linting + formatting (used in CI)
```

### Testing
```bash
npm run test            # Run all tests
npm run test:ui         # Run tests with UI
```

### Building
```bash
npm run build           # Build renderer + main
npm run build:renderer  # Build Vite app
npm run build:main      # Compile TypeScript
```

### Packaging
```bash
npm run package         # Package for current platform
npm run package:mac     # Package for macOS only
npm run package:win     # Package for Windows only
npm run package:linux   # Package for Linux only
npm run package:all     # Package for all platforms
```

### Cleanup
```bash
npm run clean           # Remove dist folder
```

## 📦 Build Outputs

### Development Build (`npm run build`)
```
dist/
├── main/              # Compiled main process
│   ├── main.js
│   └── assets/
└── renderer/          # Built React app
    ├── index.html
    ├── assets/
    └── ...
```

### Production Build (`npm run package:all`)
```
release/
├── mac-arm64/
│   └── CursorX.app/
├── win-arm64-unpacked/
│   └── CursorX.exe
├── linux-arm64-unpacked/
│   └── cursorx
├── CursorX-1.0.0-arm64.dmg              # macOS installer
├── CursorX Setup 1.0.0.exe              # Windows installer
├── CursorX-1.0.0-arm64.AppImage         # Linux installer
└── [Various .yml and .blockmap files]   # Update metadata
```

## 🔐 GitHub Permissions

The workflows require these permissions (automatically granted):

- **CI Workflow**:
  - ✅ Read repository
  - ✅ Write artifacts (upload)

- **Release Workflow**:
  - ✅ Read repository
  - ✅ Write releases (create)
  - ✅ Write artifacts (upload)

## 📊 Monitoring Workflows

### View Running Workflows
1. Go to: https://github.com/luckrnx09/CursorX/actions
2. See all workflow runs
3. Click any run to see details

### Check Status Badges
Add to your README.md:
```markdown
![CI](https://github.com/luckrnx09/CursorX/workflows/CI/badge.svg)
![Release](https://github.com/luckrnx09/CursorX/actions/workflows/release.yml/badge.svg)
```

### Email Notifications
GitHub automatically emails you when:
- ✅ Workflow succeeds
- ❌ Workflow fails
- 🔄 Workflow starts (optional)

Configure in: GitHub Settings → Notifications → Actions

## 🎯 Best Practices

### 1. Commit Often, Release Sparingly
```bash
# Daily work - commits trigger CI
git commit -m "feat: add feature X"
git commit -m "fix: resolve bug Y"
git push

# When stable - create release
./scripts/release.sh 1.0.1
```

### 2. Use Descriptive Commit Messages
```bash
# Good - these become release notes
git commit -m "feat: add dark mode support"
git commit -m "fix: resolve memory leak in cursor tracker"
git commit -m "docs: update installation guide"

# Bad
git commit -m "update"
git commit -m "changes"
git commit -m "fix stuff"
```

### 3. Test Locally Before Pushing
```bash
# Always run before pushing:
npm run lint:all
npm run test
npm run build
```

### 4. Version Numbers Make Sense
```bash
# Follow semantic versioning:
./scripts/release.sh 1.0.1  # Bug fix
./scripts/release.sh 1.1.0  # New feature
./scripts/release.sh 2.0.0  # Breaking change
```

## 🚨 Common Issues

### Issue: CI fails on every commit
**Solution**: Run `npm run lint:all` locally first

### Issue: Release not created
**Solution**: Ensure tag starts with 'v' (e.g., `v1.0.0`)

### Issue: Build fails on one platform
**Solution**: Check Actions logs, fix, then create new version

### Issue: Artifacts not uploaded
**Solution**: Verify `release/` directory contains built files

## 📚 Documentation Files

- `QUICK_START_RELEASE.md` - Quick guide to create releases
- `RELEASE_GUIDE.md` - Comprehensive release documentation
- `GITHUB_WORKFLOW_SETUP.md` - CI workflow setup
- `.github/workflows/README.md` - Workflow details
- `scripts/release.sh` - Automated release script

## 🎉 Summary

You now have a complete CI/CD pipeline:
- ✅ **Every commit** → Quality checks
- ✅ **Every tag** → Production release
- ✅ **Automatic builds** → All platforms
- ✅ **User downloads** → GitHub releases

Happy releasing! 🚀
