# TBCS Durga Puja Website

Prototype website for Toronto Bengali Cultural Society's annual Durga Puja celebration.

## Structure

Static HTML/CSS/JS site, no build step required:

- `index.html`, `about.html`, `events.html`, `gallery.html`, `livestream.html`, `donate.html`, `contact.html` — pages
- `css/style.css` — shared design system (colors, typography, components)
- `js/main.js` — nav, scroll animations, countdown timer, gallery lightbox
- `images/` — photos and logo (original `.CR2` RAW camera files are kept locally but excluded from git — see `.gitignore`)

## Running locally

No dependencies needed. Either:

- Open `index.html` directly in a browser, or
- Serve it locally for a closer-to-production feel:
  ```
  python3 -m http.server 8000
  ```
  then visit `http://localhost:8000`

## Content status

This is a **prototype** — most event details, contact info, and several gallery photos
are still placeholders (marked `[PLACEHOLDER]` in the HTML). See [`CONTENT-TODO.md`](CONTENT-TODO.md)
for the full checklist of what needs real content before launch.
