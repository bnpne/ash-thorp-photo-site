# Photo Pipeline Agent Playbook

This guide documents the end-to-end steps an agent should follow to turn new image assets into Sanity-ready `photoBase` documents, verify the generated NDJSON, and patch the remote dataset.

## Prerequisites
- Python 3.10+ with `pip` available.
- Node 18+ and `npm install` already executed in this repo (`package.json` resides here).
- ImageMagick CLI (`magick`) on the `PATH` – the Python script shells out to it for ASCII art, sizing, and palette extraction.
- A recent production export unpacked under `export/extracted/production-export-*` (contains `data.ndjson`, `assets.json`, `images/`).
- New source photos staged as `.jpg` files inside `PHOTOS/`.

## 1. Transform the images and extend the export
- Ensure the desired photos are present in `PHOTOS/`; rename them before running if you want to influence titles/ordering (filenames ending with `(##)` are sorted with that index).
- From the repository root (`studio/`), run:
  ```bash
  python3 scripts/generate_q4_photobases.py
  ```
- The script will:
  - Copy processed image assets into the latest `export/extracted/production-export-*/images/` directory.
  - Append new `photoBase` documents to `data.ndjson` (maintaining trailing newline format required by Sanity).
  - Append/create entries inside `assets.json` for uploaded assets.
  - Emit ASCII art and Ghost metadata blocks automatically.
- Watch for errors about missing exports or ImageMagick; resolve and re-run.

## 2. Sanity-check the generated NDJSON
- Inspect the tail of the file to confirm the inserted docs:
  ```bash
  tail -n 40 export/extracted/production-export-*/data.ndjson
  ```
- Optional: lint a single JSON line to confirm it parses:
  ```bash
  tail -n 1 export/extracted/production-export-*/data.ndjson | jq .
  ```
  (Requires `jq`; skip if unavailable.)

## 3. Patch the production dataset
- Ensure the environment has network access and the hard-coded credentials inside `scripts/patchPhotoBases.js` remain valid. If rotating credentials, update the script or supply env vars as required.
- Run a dry run first to confirm discovery of the documents:
  ```bash
  node scripts/patchPhotoBases.js --dry-run
  ```
  (Supply an explicit path to `data.ndjson` as the first argument if you need to target a specific export folder.)
- When satisfied, remove `--dry-run` to apply the mutations:
  ```bash
  node scripts/patchPhotoBases.js
  ```
- The script uploads any new image assets referenced via `_sanityAsset`, then issues batched `createOrReplace` mutations for every `photoBase` whose title matches `q4-*`.

## 4. Post-patch verification
- Confirm the script reported successful uploads and a final “Patch applied successfully.” message.
- Spot-check the dataset via Sanity Studio or API to ensure the new documents appear with connected assets.
- Commit the updated export artifacts (`data.ndjson`, `assets.json`, `images/`) if you need to preserve a record, or discard them if they were only meant for the patch.

## Troubleshooting Tips
- **No export found**: unpack the production export tarball into `export/extracted/` before rerunning step 1.
- **ImageMagick errors**: verify `magick` is installed (`magick -version`) and restart the pipeline.
- **Missing assets on patch**: ensure the Python step completed successfully so the `images/` directory contains the referenced files and that `assets.json` has entries for each SHA1.

Keep this playbook alongside the scripts so future agents can follow a consistent pipeline.
