# Keluarga Suheri

Family profile website built with plain HTML, CSS, and JavaScript. No build
step or package installation is required.

## Run locally

Open `index.html` in a browser, or serve this folder over HTTP:

```sh
python3 -m http.server 8123
```

Then visit `http://localhost:8123`.

GSAP and ScrollTrigger load from jsDelivr for the hero entrance and scroll
reveals. If the CDN is unavailable, the page content, navigation, and statistics
remain usable; only the optional motion is skipped. Reduced-motion preferences
are respected. The loading screen has a fallback timeout so it cannot block the
page indefinitely.

## Project structure

- `index.html`: page metadata, accessible markup, and content
- `css/site.css`: page theme, layout, responsive styles, and components
- `js/main.js`: loading screen, image fallback, navigation, and member dialog
- `js/animations.js`: optional GSAP entrance and scroll animations
- `js/counters.js`: statistic count-up behavior

## Replace photos

The hero and family portraits currently use files in `assets/src/`. Replace
those files or update their relative paths in `index.html`. Keep the `alt`
text descriptive if the subject of a photo changes.
