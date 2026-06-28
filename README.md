# Viscal

A browser-based generative art playground built with React + Vite + Tailwind CSS. Create parametric visuals driven by math — Lissajous curves, L-Systems, and reaction-diffusion (Gray-Scott) simulations.

## Features

- **Lissajous Curves** — x/y frequency, phase offset, amplitude, stroke controls
- **L-Systems** — 5 presets (Plant, Sierpinski, Koch, Dragon, Hilbert) with iteration control
- **Reaction-Diffusion** — Gray-Scott simulation with 5 presets, 3 colormaps, play/pause
- **Export** — PNG, high-res 2x PNG, and SVG download

## Stack

- React 18, Vite 6, Tailwind CSS 3
- HTML5 Canvas (Lissajous, RD) + SVG (L-Systems)
- No external UI libraries

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## Build

```bash
npm run build
npm run preview
```

Made with love by Llenoxinn.
