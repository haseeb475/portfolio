# Haseeb Ramzan — Portfolio

A personal portfolio styled as an engineer's lab notebook with live instruments: paper-and-ink editorial pages, with dark "instrument panels" for the technical visuals.

**Stack:** Next.js 16 (App Router, static export) · React 19 · TypeScript · Tailwind CSS v4 · Motion (`LazyMotion`) · Lucide

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # static site in ./out
```

## Edit content

All copy lives in **`src/content/profile.ts`**. Components never hard-code text.

- Search the file for `TODO` to find missing information. Placeholder links and screenshot slots render on the site with a dashed amber underline, so they're hard to miss.
- Search for `// verify` to find prose that interprets a CV bullet. Read it and adjust.
- **Résumé:** add `public/resume.pdf`. The buttons turn on automatically at build time. Consider removing your phone number first.
- **Contact form:** works out of the box by opening the visitor's email app with the message filled in. To receive messages straight in your inbox instead, create a free form at formspree.io and set `NEXT_PUBLIC_CONTACT_ENDPOINT` to its URL (e.g. `https://formspree.io/f/abcd1234`) in your host, then redeploy.
- **The road so far (journey section):** the order of stages, their tulip arrows and pace notes live in `journey` in `profile.ts`. Map coordinates for the desktop stage map are in `components/sections/Journey.tsx` (`WAYPOINTS`).
- **Experience vs. projects:** employers go in `experience`; independent, academic and open-source work goes in `projects` (case studies) or `moreProjects` (compact list). Keep them separate.
- **Domain:** set `NEXT_PUBLIC_SITE_URL` (e.g. `https://example.com`) in your host. It's used for canonical, Open Graph, sitemap and robots URLs.

## Structure

```
src/
  app/            layout (fonts, theme, metadata), page, OG image, icon, sitemap, robots, 404
  content/        profile.ts — single source of truth
  components/
    hero/         AgentTrace — simulated replay of Coding Lambda's state machine
    projects/     CaseStudy, MetricCounter, diagrams/ (data-driven SVG engine + specs)
    sections/     Hero, About, Journey (rally map), Projects, Expertise, Beyond (logbook), Contact
    layout/       Nav (scroll-spy, mobile sheet), ThemeToggle, MotionProvider, SkipLink
    ui/           SplitWords, Reveal, MagneticButton, Panel, SectionHeader, CopyEmail, LocalTime, …
  lib/            motion tokens, hooks, helpers
```

Architecture diagrams are plain data: nodes, edges and groups in `components/projects/diagrams/specs.ts`. Edit the coordinates there.

## Notes

- **Motion:** honours `prefers-reduced-motion` everywhere. Hero text animates with CSS so it paints before hydration (good for LCP).
- **Theme:** follows the OS setting until the visitor toggles it. The choice is applied before first paint, so there's no flash.
- **Cache Components is disabled:** it forbids the `dynamic = "force-static"` config that static export needs for the sitemap, robots and OG routes.
- **Deploying:** works on any static host (Vercel, Netlify, Cloudflare Pages, GitHub Pages). Serve with compression and long cache headers for `/_next/static`.
