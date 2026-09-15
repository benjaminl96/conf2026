# Splunk React App Template

A starting point for building React applications that run as Splunk apps. The repository includes the team's
frontend build, code-quality, release, packaging, and AppInspect conventions while intentionally shipping only small
demo views.

## What is included

- React 18 and Material UI
- React Router for single page app routing inside a Splunk-hosted view
- Vite development and production builds
- Splunk Web mounting through `@splunk/react-page`
- Splunk-compatible `app/` package layout
- ESLint, Prettier, Vitest, lint-staged, Husky, and Conventional Commits
- Taskfile workflows for build, package, cleanup, and AppInspect
- Release It configuration that keeps Splunk version metadata synchronized
- A React home page, a React sub-page, a Simple XML dashboard, and a Dashboard Studio dashboard

Feature-specific searches, REST handlers, Python commands, lookups, premium licenses, legacy JavaScript, and compiled
assets are deliberately excluded.

## Requirements

- Node.js 24 (see `.nvmrc`)
- npm
- [Task](https://taskfile.dev/) for packaging commands
- Python 3.9 or newer for Splunk packaging and AppInspect

## Development

```sh
npm ci
npm run dev
```

The Vite server runs at `http://localhost:3001`. In development mode the app mounts into a normal `#root` element.
Production builds use Splunk's React page layout automatically.

Useful checks:

```sh
npm run lint
npm test
npm run build
```

The production build is written to `app/appserver/static/dist/`, where Splunk expects the home view assets.

## Hybrid dashboard architecture

This skeleton intentionally includes three different page types so teams can see where each framework begins and ends.

Splunk-owned views live in `app/default/data/ui/views/` and are resolved by Splunk Web before any React code runs.
Those views can be listed in `app/default/data/ui/nav/default.xml` and should have permissions in
`app/metadata/default.meta` when appropriate.

- `home.xml` is an HTML Splunk view that mounts the compiled React single page app from `app/appserver/static/dist/`.
- `simple_xml_hello.xml` is a traditional Simple XML dashboard built from supported Splunk XML elements such as
  `form`, `row`, `panel`, `single`, `table`, and `chart`.
- `dashboard_studio_hello.xml` is a Dashboard Studio view using `dashboard version="2"` and an embedded Studio
  definition.

React-owned pages live in `src/` and render only after Splunk has already served a view template. In this repo,
`src/App.jsx` uses React Router to switch between React pages inside the mounted single page app.

## Single page app routing

Splunk controls top-level URLs under `/en-US/app/<app_id>/<view_name>`. A direct browser request for one of those URLs
must match a Splunk view file in `app/default/data/ui/views/`; otherwise Splunk returns its own unknown-route response
before React can mount.

This distinction is the main routing rule for the hybrid architecture:

- Safe direct load for the React app: `/en-US/app/conf2026/home`
- Safe React sub-page: `/en-US/app/conf2026/home#/sub-page`
- Not direct-load safe without a Splunk view file: `/en-US/app/conf2026/react-only`

The `home#/sub-page` route works because Splunk receives only `/en-US/app/conf2026/home`, which maps to `home.xml`.
The `#/sub-page` fragment stays in the browser and is handled by React Router after the SPA mounts.

Use top-level Splunk views for pages that must be discoverable by Splunk navigation, direct browser refreshes, browser
bookmarks without fragments, role-based view permissions, or Splunk-native dashboard editing. Use React sub-routes for
SPA flows that belong inside an already mounted React view, especially when the page shares React state, client-side
navigation, components, and application layout.

## Package and inspect

```sh
task package
task inspect
```

`task package` installs the required tools into `.venv`, builds the frontend, and creates
`dist/conf2026-0.1.0.tar.gz`. `task inspect` runs Splunk AppInspect against that archive.

## Use this for a new app

1. Replace `conf2026` with the new Splunk app ID in:
   - `package.json`
   - `vite.config.js`
   - `app/default/app.conf`
   - `app/app.manifest`
   - `app/default/data/ui/views/home.xml`
   - `Jenkinsfile`
2. Update the app title, description, author, repository URL, and license placeholders.
3. Replace the demo content in `src/pages/Home/index.jsx`.
4. Add Splunk views for any new top-level pages that need direct URL access through Splunk Web.
5. Add React sub-routes for SPA pages that should live inside an existing Splunk HTML view.
6. Keep Simple XML and Dashboard Studio dashboards in `app/default/data/ui/views/` when the page should remain a
   Splunk-native dashboard.
7. Run lint, tests, build, package, and AppInspect before release.

Keep the app ID lowercase and free of spaces. The value must stay synchronized across the Vite asset base URL,
Splunk configuration, manifest, and view template path.
