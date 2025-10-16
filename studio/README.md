# Sanity Clean Content Studio

Congratulations, you have now installed the Sanity Content Studio, an open-source real-time content editing environment connected to the Sanity backend.

Now you can do the following things:

- [Read “getting started” in the docs](https://www.sanity.io/docs/introduction/getting-started?utm_source=readme)
- [Join the community Slack](https://slack.sanity.io/?utm_source=readme)
- [Extend and build plugins](https://www.sanity.io/docs/content-studio/extending?utm_source=readme)

## Q4 photobase pipeline

This project includes helper scripts for generating and importing the quarterly photoBase data.

### 1. Generate photoBases from local images

```
python3 scripts/generate_q4_photobases.py
```

The script expects `.jpg` assets in `./PHOTOS/`, emits ASCII + Ghost metadata, copies image assets into the latest directory under `export/extracted/`, and appends the new photoBase documents to its `data.ndjson`/`assets.json`.

> Before using the Node helper below, make sure dependencies are installed: `npm install`.

### 2. Patch the production dataset

```
node scripts/patchPhotoBases.js export/extracted/<production-export>/data.ndjson
```

Omit the path argument to have the script pick the newest `production-export-*` folder automatically.

Requires the following environment variables:

- `SANITY_PROJECT_ID`
- `SANITY_DATASET`
- `SANITY_API_TOKEN` (with mutation permission)
- `SANITY_API_VERSION` (optional, defaults to `2023-10-01`)

Use `--dry-run` to inspect without committing changes.
