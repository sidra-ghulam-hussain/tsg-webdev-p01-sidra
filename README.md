# Sidra Ghulam Hussain — Personal Portfolio

A single-page personal portfolio built from an empty file with **HTML5, CSS3 and vanilla JavaScript**. No framework, no page builder, no template.

**Live site:** https://sidra-ghulam-hussain.netlify.app/#home
**Repository:** https://github.com/sidra-ghulam-hussain/tsg-webdev-p01-sidra

Submitted for **The Sky Gen — Web Development, Project 01** (Ref: TSG/WD/P01/2026).

---

## The idea behind the design

My work is mostly real-time, multi-user systems — Socket.IO, WebRTC meshes, live sync. So the hero of the page is not a stock gradient: it is a small canvas sketch of a peer-to-peer network. Nodes drift, a line is drawn between any two that are close enough to connect, and the cursor joins the mesh as an extra peer. The page demonstrates the thing the page is about.

Everything else is deliberately quiet so that one element carries the visual weight:

- **Typography** — Bricolage Grotesque for display and interface, Newsreader for reading prose. Two clearly different voices, neither of them a default.
- **Colour** — a cool bone background with deep petrol ink, and a single electric blue kept for live and interactive states only, plus a pine green for progress and confirmation. Both themes are built from the same token set.
- **Artwork** — every project cover is an original SVG I generated to describe that project's shape: a full mesh for Confero, Kanban columns mid-drag for Flowdeck, a follow graph for Pulse Circle. Nothing is stock, so nothing needs a licence.

---

## Features

| Area | What is there |
| --- | --- |
| Navigation | Fixed bar, smooth scroll to five sections, scroll-spy active state, reading-progress hairline, mobile slide-down menu |
| Hero | Name, one-line tagline, portrait, primary call to action, interactive peer-mesh canvas |
| About | 115-word bio, four credential facts, downloadable CV |
| Skills | Nine skills with Font Awesome icons and progress meters that fill when scrolled into view |
| Projects | Six cards with original cover art, description, tech stack and links, plus category filters |
| Contact | Form with custom JavaScript validation and written error messages, direct email, phone, GitHub and LinkedIn |
| Footer | Copyright line with live year and social icons |
| Interactions | Dark/light theme switch (remembered between visits), mobile menu toggle, back-to-top button, project filtering, ten CSS hover states |
| Accessibility | Semantic landmarks, skip link, visible focus rings, ARIA labels on icon buttons, `prefers-reduced-motion` respected |

## Responsive behaviour

Checked at all three required widths with no horizontal scrolling:

| Width | Layout |
| --- | --- |
| 360px | Single column, hamburger menu, stacked stats, full-width buttons |
| 768px | Two-column skills and project grids, stacked hero |
| 1440px | Three-column grids, side-by-side hero and contact |

## Tech stack

- HTML5 — semantic sectioning, landmark roles
- CSS3 — custom properties for theming, Flexbox, CSS Grid, `clamp()` fluid type, media queries
- JavaScript (ES6) — Canvas 2D API, IntersectionObserver, `requestAnimationFrame`, `localStorage`, form validation
- Google Fonts — Bricolage Grotesque, Newsreader
- Font Awesome 6.5.2 — icons
- Git & GitHub — version control
- Deployed on Netlify

## Project structure

```
tsg-webdev-p01-sidra/
├── index.html                 # All markup, five sections
├── css/
│   └── style.css              # Tokens, layout, components, breakpoints
├── js/
│   └── script.js              # Nine self-contained init functions
├── assets/
│   ├── covers/                # Original SVG artwork, one per project
│   ├── screenshots/           # Mobile, tablet and desktop captures
│   ├── profile.jpg            # Hero portrait, clipped to a circle in CSS
│   ├── favicon.svg
│   └── Sidra_Ghulam_Hussain_CV.pdf
└── README.md
```

## Running it locally

No build step and no dependencies — it is three files and a folder of assets.

```bash
git clone https://github.com/sidra-ghulam-hussain/tsg-webdev-p01-sidra.git
cd tsg-webdev-p01-sidra
```

Then either open `index.html` in a browser, or serve it so relative paths behave exactly as they do in production:

```bash
python3 -m http.server 5500
# visit http://localhost:5500
```

In VS Code, the Live Server extension does the same thing with **Go Live**.

## Deploying

Netlify: drag the project folder onto https://app.netlify.com/drop, or connect the repository and deploy with no build command and `.` as the publish directory. The same folder works unchanged on Vercel or GitHub Pages, because there is nothing to compile.

## Credits

- Icons — [Font Awesome Free 6.5.2](https://fontawesome.com), CC BY 4.0
- Typefaces — [Bricolage Grotesque](https://fonts.google.com/specimen/Bricolage+Grotesque) and [Newsreader](https://fonts.google.com/specimen/Newsreader), SIL Open Font License
- All project cover artwork, the favicon and the layout are my own work

## Licence

MIT — reuse the code, but please replace the content with your own.
