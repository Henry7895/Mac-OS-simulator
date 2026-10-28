# macOS Simulator — Golden Gate

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)
[![Version](https://img.shields.io/badge/version-1.0.1-informational.svg)](https://github.com/Henry7895/Mac-OS-simulator/releases)

An original, interactive desktop simulation inspired by modern desktop design and translucent “glass” interfaces. It is an educational project and is **not affiliated with Apple**. It does not contain Apple logos, wallpapers, or proprietary icons.

## Screenshots

Screenshots will be added here after the first published build:
- Boot and lock screens
- Liquid-glass desktop, menu bar and Dock
- Finder, Notes, Terminal, Photos and System Settings

## Features

- Animated boot sequence followed by a multi-step first-run assistant: language, region, accessibility options, simulated Wi-Fi, privacy, account/profile photo, appearance and wallpaper. The profile is editable from the lock screen; desktop inactivity triggers auto-lock after one minute.
- Draggable/resizable app windows, minimize/maximize, edge snapping, context menu and Dock.
- Menu bar with app menus, live date/time, Spotlight search and Control Center.
- Finder with a persisted virtual file system; folders and files can be created, previewed, and moved to Trash.
- Safari-style browser with tabs, address bar/search, back/forward/reload, favorite sites and a real browsing surface: Electron uses an embedded webview; GitHub Pages uses an iframe where the target site allows embedding, with an external-browser fallback for blocked sites.
- Terminal commands: `help`, `ls`, `cd`, `pwd`, `mkdir`, `touch`, `rm`, `cat`, `echo`, `clear`, `whoami`, `date`, `neofetch`.
- Notes with auto-save; Photos wallpaper gallery; an Apple Music-inspired player that searches the public iTunes catalogue, streams official short previews, and links to full tracks on Apple Music and the official NCS channel (no copyrighted music files are bundled).
- System Settings for appearance, wallpaper, brightness, volume, Dock and simulated device information.
- Calculator, navigable Calendar with saved events, and a restorable Trash.
- App Store-style catalogue with install/remove controls; installing an extra app adds it to the Dock and persists it locally. Includes Weather (Open-Meteo), Voice Memos (microphone permission), Freeform, Books, Activity Monitor and Clock.
- UI language selection for French, English, Spanish, German, Italian and Japanese. The selected locale is persisted and applied to the setup assistant, window/menu text, app labels and date/time formats; some less-common app-specific strings may still fall back to French.
- Light/dark appearance, original layered CSS aurora wallpapers, and background-only brightness control so the interface itself stays readable.
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

The `.github/workflows/pages.yml` workflow builds the static site and publishes `dist/` directly to the `gh-pages` branch on pushes to `main`. It deliberately avoids the Actions artifact upload service, so deployment does not depend on an exhausted artifact quota. The workflow cleans up stored Actions artifacts from this repository before building; this does not delete Git releases or source files. It also tries to configure branch-based Pages publishing and explicitly request a build because pushes made with `GITHUB_TOKEN` do not automatically trigger a Pages build.

The workflow configures **Settings → Pages** automatically when the repository and plan permit it. If the workflow log reports that Pages could not be configured, open **Settings → Pages**, select **Deploy from a branch**, choose the `gh-pages` branch and the `/(root)` folder, then save. Private-repository Pages availability depends on your GitHub plan. Vite uses relative asset paths for project subpaths.

## Download for Windows

Open [GitHub Releases](https://github.com/Henry7895/Mac-OS-simulator/releases) and download **macos-simulator-setup.exe**. Run the installer on Windows 10/11 x64. Windows may show its standard SmartScreen warning because the installer is not code-signed; only continue if you trust the source.

To produce a release, push a version tag such as `v1.0.0`. GitHub Actions builds the Windows NSIS installer and attaches it to the matching GitHub Release.

## Project structure

```
src/
  apps/             Finder, Safari, Terminal, Notes, Photos, Music, Settings, utilities
  components/       Multi-step SetupAssistant, boot, lock screen, desktop, menu bar, Dock, windows and overlays
  store/            Persisted simulator state
  assets/            Original CSS/SVG-style visuals
electron/            Electron main process and preload
.github/workflows/   Windows release and GitHub Pages deployment
```

## Recent application improvements

- Minimizing a window hides it without unmounting its React tree, so app state is preserved and the Dock restores the same window.
- Safari and Music are separate reusable components. System web builds cannot bypass websites' iframe restrictions, so Safari offers an external-browser fallback where necessary.
- Music now opens in a full-track NCS mode by default, using official NCS YouTube uploads with native player controls. iTunes previews are in a separate mode and are explicitly labelled as short excerpts; Apple Music links go to the official service.

## Creative software in the App Store

The App Store includes official download/source links for these real open-source applications, which are not installed inside the simulator:

- **ArtCraft** — AI-assisted creative studio for image, video and 3D work.
- **PhotoCraft** — photo editor with layers and PSD support.
- **FilmCraft** — nonlinear video editor with colour and audio tools.
- **LightCraft** — photo library and non-destructive RAW development.

The creator credit displayed for these apps is **ArtCraft Team et contributeurs**. Their code is dual-licensed under MIT or Apache-2.0; the simulator links to the publishers' release pages rather than repackaging their binaries or assets.

## Design reference

The window-lifecycle pattern and desktop interaction references were adapted from the MIT-licensed [MacOS-Web-Simulator project](https://github.com/LikhithSP/MacOS-Web-Simulator). Its README also links to the [macX live demo](https://macx-ruddy.vercel.app/), which is used as a visual reference for desktop polish. Golden Gate maintains its own React implementation and does not bundle upstream wallpapers, logos or icon assets. See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for attribution.

## License and attribution

Released under the MIT License; see [LICENSE](LICENSE). This is an independent educational homage to a desktop operating-system UI. “macOS” and Apple product names are trademarks of Apple Inc.; this project is unofficial, uses original artwork, and does not bundle Apple assets.
