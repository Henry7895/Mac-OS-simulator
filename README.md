# macOS Simulator — Golden Gate

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)
[![Version](https://img.shields.io/badge/version-1.0.0-informational.svg)](https://github.com/Henry7895/Mac-OS-simulator/releases)

An original, interactive desktop simulation inspired by modern desktop design and translucent “glass” interfaces. It is an educational project and is **not affiliated with Apple**. It does not contain Apple logos, wallpapers, or proprietary icons.

## Screenshots

Screenshots will be added here after the first published build:
- Boot and lock screens
- Liquid-glass desktop, menu bar and Dock
- Finder, Notes, Terminal, Photos and System Settings

## Features

- Animated boot flow, first-run setup, lock screen, desktop and inactivity lock.
- Draggable/resizable app windows, minimize/maximize, edge snapping, context menu and Dock.
- Menu bar with app menus, live date/time, Spotlight search and Control Center.
- Finder with a persisted virtual file system; folders and files can be created, renamed, edited and moved to Trash.
- Simulated Safari with address bar, tabs, internal pages and best-effort embedded websites.
- Terminal commands: `help`, `ls`, `cd`, `pwd`, `mkdir`, `touch`, `rm`, `cat`, `echo`, `clear`, `whoami`, `date`, `neofetch`.
- Notes with auto-save and search; Photos wallpaper gallery; generated-sound Music player.
- System Settings for appearance, wallpaper, brightness, volume, Dock and simulated device information.
- Calculator, navigable Calendar with saved events, and a restorable Trash.
- Light/dark appearance and original CSS-generated aurora wallpapers.
- Browser build deployable to GitHub Pages and Windows installer packaged with Electron.

## Stack

React 19, Vite, Tailwind CSS, Framer Motion, react-rnd, Lucide React, Electron and electron-builder. Settings, notes, files and calendar events are saved in `localStorage`.

## Run locally

Requires Node.js 20 or newer.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. To run the desktop shell while developing:

```bash
npm run electron:dev
```

Build the static site:

```bash
npm run build
```

## GitHub Pages

The `.github/workflows/pages.yml` workflow builds the static version and deploys it on pushes to `main`. In **Settings → Pages**, choose **GitHub Actions** as the build and deployment source if it is not already selected. Vite uses relative asset paths so the app works from a project subpath.

## Download for Windows

Open [GitHub Releases](https://github.com/Henry7895/Mac-OS-simulator/releases) and download **macos-simulator-setup.exe**. Run the installer on Windows 10/11 x64. Windows may show its standard SmartScreen warning because the installer is not code-signed; only continue if you trust the source.

To produce a release, push a version tag such as `v1.0.0`. GitHub Actions builds the Windows NSIS installer and attaches it to the matching GitHub Release.

## Project structure

```
src/
  apps/             Finder, Safari, Terminal, Notes, Photos, Music, Settings, utilities
  components/       Boot, setup, lock screen, desktop, menu bar, Dock, windows and overlays
  store/            Persisted simulator state
  assets/            Original CSS/SVG-style visuals
electron/            Electron main process and preload
.github/workflows/   Windows release and GitHub Pages deployment
```

## License and attribution

Released under the MIT License; see [LICENSE](LICENSE). This is an independent educational homage to a desktop operating-system UI. “macOS” and Apple product names are trademarks of Apple Inc.; this project is unofficial, uses original artwork, and does not bundle Apple assets.
