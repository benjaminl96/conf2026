# Splunk React App Template

An Atlas-derived starting point for building React applications that run as Splunk apps. The repository preserves
the team's frontend build, code-quality, release, packaging, and AppInspect conventions while intentionally shipping
only one small demo view.

## What is included

- React 18 and Material UI
- Vite development and production builds
- Splunk Web mounting through `@splunk/react-page`
- Splunk-compatible `app/` package layout
- ESLint, Prettier, Vitest, lint-staged, Husky, and Conventional Commits
- Taskfile workflows for build, package, cleanup, and AppInspect
- Release It configuration that keeps Splunk version metadata synchronized
- An Atlas-inspired, hello-world home page

Atlas-specific features, searches, REST handlers, Python commands, lookups, premium licenses, legacy JavaScript, and
compiled assets are deliberately excluded.

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
4. Add routes and Splunk views as the app grows. Every additional Splunk view should point to the compiled HTML
   template and have an entry in navigation and metadata where appropriate.
5. Run lint, tests, build, package, and AppInspect before release.

Keep the app ID lowercase and free of spaces. The value must stay synchronized across the Vite asset base URL,
Splunk configuration, manifest, and view template path.
