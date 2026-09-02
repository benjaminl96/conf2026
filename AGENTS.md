# Splunk React App Agent Guide

## Repository overview

- This is a React 18 + Vite SPA packaged as a Splunk app.
- Frontend source lives in `src/`.
- Vite writes deployable assets to `app/appserver/static/dist/`.
- Splunk packaging configuration lives under `app/`.

## Common commands

- Install dependencies: `npm ci`
- Start local development: `npm run dev`
- Lint: `npm run lint`
- Test: `npm test`
- Build frontend assets: `npm run build`
- Package the Splunk app: `task package`
- Run Splunk AppInspect: `task inspect`

## Working expectations

- Keep the Splunk app ID synchronized in `package.json`, `vite.config.js`, `app/default/app.conf`,
  `app/app.manifest`, and the Splunk view template path.
- Edit source files rather than generated content in `app/appserver/static/dist/`.
- Preserve the Splunk packaging layout and verify frontend changes with lint and build.
- Follow the existing MUI and `sx` styling patterns before adding another styling system.
