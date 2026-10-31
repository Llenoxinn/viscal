# Viscal

A local-first generative art studio. Explore the patterns behind Lissajous curves, fractals, and Gray–Scott reaction diffusion, then export what you make.

## Run locally

Use Node.js 22.12 or newer and npm.

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. For a production preview:

```sh
npm run build
npm run preview
```

## Inside the studio

- **Lissajous curves:** five starting points, frequency and phase controls, independent amplitudes, sample count, stroke width, opacity, and color.
- **L-Systems:** plant, Sierpinski, Koch, Dragon, and Hilbert presets; per-preset iteration limits; angle, step length, and stroke controls. Oversized patterns stop with a helpful error.
- **Reaction diffusion:** five presets, three palettes, feed/kill and diffusion controls, play/pause, and reset. Paint to seed a pattern or use **Add seed**. Switching engines preserves your work and pauses inactive simulations. Hidden browser tabs stop the animation loop; reduced-motion users start with the simulation paused.
- **Export:** PNG and 2× PNG for all engines, plus SVG for curves and fractals. Vector artwork is rasterized at the requested size. Simulation PNGs use the native 240 × 180 grid (480 × 360 at 2×), with sharp pixels rather than invented detail. The canvas guide grid is never exported.
- **Keyboard:** Tab through labeled controls; use arrow keys on sliders and engine tabs. Home/End select the first/last engine tab. Escape closes the math explanation.

Everything renders in your browser. Artwork is not uploaded or stored remotely. No external fonts, UI libraries, or animation libraries are loaded.

## Checks

```sh
npm run check
npm audit
```

`check` validates Git hygiene, runs the Node regression tests, and builds the production bundle. GitHub Actions runs these checks on pushes and pull requests. Tests cover curve bounds and closure, fractal limits and drawing commands, simulation stability and buffer reuse, and forbidden repository paths.

## Keep the repository clean

Commit source files, configuration, tests, and **package-lock.json**. The lockfile contains `node_modules/...` keys as dependency metadata; those entries are expected and are not the installed files.

`.gitignore` excludes dependency folders (including nested ones), build output, local environment files, logs, and browser artifacts. `npm run check:repo` also rejects these paths if they enter Git's index, since ignore rules alone do not untrack existing files.

To check a checkout:

```sh
git ls-files node_modules dist
```

If those paths are already tracked, remove them from the index while keeping local files:

```sh
git rm -r --cached --ignore-unmatch node_modules dist
```

Commit the removal and the ignore rules. This removes files from the next revision; it does not rewrite previously pushed history.

## Branches and commits

Git branch names cannot contain colons or spaces. Use the requested category as a slash prefix, with a short description:

```text
feat/revamp-viscal
chore/dependency-cleanup
task/update-documentation
```

Use `feat: description`, `chore: description`, or `task: description` for commit messages and pull request titles.

## Stack

React 18, Vite 6, native SVG/Canvas, and plain CSS. Node's built-in test runner keeps the development dependency list small.

Made by [Llenoxinn](https://github.com/Llenoxinn).
