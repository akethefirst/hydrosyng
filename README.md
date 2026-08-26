# Hydrosyng Oil & Gas Ltd — Website

A lightweight, fast, static website for **Hydrosyng Oil & Gas Ltd** (RC 1232655),
built with [Astro](https://astro.build). Ships **zero JavaScript by default**
(only a tiny vanilla script for the menu, scroll animations and the contact
form), so pages are small and load quickly. Deploys automatically to
**GitHub Pages** at **https://hydrosyng.com.ng**.

Brand colours (royal blue + bright azure) are sampled from the company logo and
defined once at the top of `src/styles/global.css`.

---

## Quick start

```bash
npm install      # install dependencies (one time)
npm run dev      # start local dev server at http://localhost:4321
npm run build    # build the static site into dist/
npm run preview  # preview the production build locally
```

Requires Node 18.20+, 20.3+ or 22+ (works on your Node 24).

---

## Project structure

```
hydrosyng/
├─ public/                 Static assets served as-is
│  ├─ img/                 Photos (see "Images" below)
│  ├─ favicon.svg          PLACEHOLDER icon — replace with your real favicon
│  ├─ CNAME                Custom domain for GitHub Pages (hydrosyng.com.ng)
│  ├─ robots.txt
│  └─ sitemap.xml
├─ src/
│  ├─ data/site.js         ← EDIT company details here (phone, address, etc.)
│  ├─ styles/global.css    ← Design system + brand colours (one file)
│  ├─ scripts/main.js      Tiny vanilla JS (nav, reveal, form)
│  ├─ components/          Header, Footer, Icon, PageHero
│  ├─ layouts/Base.astro   Shared HTML shell + SEO
│  └─ pages/               One file per page → one URL
│     ├─ index.astro       Home            /
│     ├─ about.astro       About           /about
│     ├─ services.astro    Services        /services
│     ├─ projects.astro    Projects        /projects
│     ├─ hse.astro         HSE             /hse
│     ├─ careers.astro     Careers         /careers
│     ├─ news.astro        News            /news
│     ├─ contact.astro     Contact         /contact
│     ├─ thank-you.astro   Form success    /thank-you
│     └─ 404.astro         Not found
├─ .github/workflows/deploy.yml   GitHub Pages auto-deploy
└─ astro.config.mjs
```

---

## >>> ACTION NEEDED: add your real logo <<<

I did **not** generate a logo. The header and footer currently show a text
wordmark ("HYDROSYNG — Oil & Gas Ltd") automatically, because the logo image is
missing.

To use your real flame/droplet logo, save it as:

```
public/img/hydrosyng-logo.png
```

Recommended: a **transparent PNG** (or SVG saved as that name), roughly 320–520px
wide. The header shows it at ~56px tall; the footer sits it on a white chip, so a
normal full-colour logo works in both places. As soon as that file exists, it
appears everywhere — no code changes needed.

Then replace `public/favicon.svg` with a real favicon made from the logo.

---

## Things to replace (placeholders)

Open **`src/data/site.js`** and fill in the real values. Current placeholders:

| Field          | Current value                | Notes                          |
|----------------|------------------------------|--------------------------------|
| `phoneDisplay` | `+234 000 000 0000`          | Add the real company line      |
| `phoneHref`    | `+2340000000000`             | Same number, digits only       |
| `addressFull`  | Abuja placeholder            | Confirm the registered office  |
| `socials`      | `#`                          | Add LinkedIn / X / FB / IG URLs|
| `mapEmbed`     | empty                        | Paste a Google Maps embed URL to show a map on Contact |

**Real, already-filled details** (from the Certificate of Incorporation):
company name, **RC 1232655**, incorporated **2014**, tagline *"Powering Progress
Through Reliable Energy"*, and email `info@hydrosyng.com.ng`.

Illustrative placeholder content you may want to replace: leadership (shown as
roles, no names), projects, news posts and open roles.

---

## Images

`public/img/` holds **real, commercially-licensed stock photographs** sourced
from [Wikimedia Commons](https://commons.wikimedia.org) (not AI-generated). Most
are **CC BY / CC BY-SA**, so if you keep them on the live site you must keep
attribution — every image's author, license and source page is listed in
[`CREDITS.md`](CREDITS.md).

**Recommended:** replace them with Hydrosyng's own photos (facilities, stations,
trucks, team) by dropping your files into `public/img/` using the same filenames
(e.g. `hero-refinery.jpg`, `banner-services.jpg`, `project-1.jpg`). Your own
photos are more authentic and remove any attribution requirement.

---

## Contact form

The site is static, so the contact form opens the visitor's email app
pre-filled and sends to `info@hydrosyng.com.ng` (no server required). To get
submissions straight to an inbox instead, sign up for a free form service like
[Web3Forms](https://web3forms.com) or [Formspree](https://formspree.io) and
change the `<form>` in `src/pages/contact.astro` to POST to their endpoint —
the built-in validation still works.

---

## Deploy to GitHub Pages (hydrosyng.com.ng)

1. **Create a GitHub repo** and push this folder to the `main` branch.
2. In the repo: **Settings → Pages → Build and deployment → Source = GitHub
   Actions**.
3. Every push to `main` runs `.github/workflows/deploy.yml`, which builds the
   site and publishes it. (`public/CNAME` already sets the custom domain.)
4. **DNS for `hydrosyng.com.ng`** — at your domain registrar, point the apex
   domain to GitHub Pages with four `A` records:

   ```
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153
   ```

   (Optional `www` → add a `CNAME` record pointing to `<your-username>.github.io`.)
5. In **Settings → Pages**, set the custom domain to `hydrosyng.com.ng` and
   enable **Enforce HTTPS** once the certificate is issued.

That's it — future edits just need `git push`.
