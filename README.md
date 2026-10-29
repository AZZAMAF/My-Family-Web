# My-Family-Web

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
are respected. A short loading screen closes when the page loads, with a
fallback timeout so it cannot block the page indefinitely.

## Edit the page

- Page copy and section structure: `index.html`
- Colors, typeface, and spacing tokens: `css/tokens.css`
- Reset, layout, components, and motion preferences: `css/base.css`,
  `css/layout.css`, `css/components.css`, and `css/animations.css`
- Navigation and animation setup: `js/main.js` and `js/animations.js`
- Statistic count-up behavior: `js/counters.js`

## Replace photos

The hero and family portraits currently use files in `assets/src/`. Replace
those files or update their relative paths in `index.html`. Keep the `alt`
text descriptive if the subject of a photo changes.
