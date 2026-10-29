# My Family Web

A responsive family profile website for Keluarga Suheri. The site introduces
family members, shares the values that bring them together, and presents their
story through a lightweight static web experience.

## Features

- Responsive layout and mobile navigation
- Interactive family-member profiles with detail dialogs
- Family statistics and optional scroll animations
- Keyboard-friendly navigation and support for reduced-motion preferences
- Graceful fallbacks when third-party animation libraries are unavailable

## Built with

- HTML, CSS, and vanilla JavaScript
- GSAP and ScrollTrigger for optional motion effects, loaded from jsDelivr
- Plus Jakarta Sans, loaded from Google Fonts

No build step, package manager, or installation is required. The site can be
opened directly in a browser. An internet connection is needed to load the
hosted font and animation libraries; the core page remains usable if those
services are unavailable.

## Run locally

Open `index.html` in a browser, or serve the project directory over HTTP:

```sh
python3 -m http.server 8123
```

Visit [http://localhost:8123](http://localhost:8123) to view the site.

## Project structure

```text
.
├── index.html              # Page content and metadata
├── assets/
│   ├── icons/              # Site logo
│   └── src/                # Family and hero photos
├── css/
│   ├── site.css            # Main stylesheet entry point
│   ├── base.css            # Base styles
│   ├── tokens.css          # Design tokens
│   ├── layout.css          # Page layout and responsive styles
│   ├── components.css      # Component styles
│   └── animations.css      # CSS animations
└── js/
    ├── main.js             # Navigation, loading screen, and member dialogs
    ├── animations.js       # Optional GSAP entrance and scroll animations
    └── counters.js         # Animated statistic counters
```

## Update the photos

Photos are stored in `assets/src/`. Keep the existing filenames when replacing
them, or update the corresponding image paths in `index.html`. If a photo's
subject changes, update its `alt` text to describe the new image.

## Deployment

This is a static website and does not require a backend or build process. Deploy
the project directory to any static web host, with `index.html` as the entry
point.
