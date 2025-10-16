#!/usr/bin/env node

/**
 * Patch Sanity dataset with the generated Q4 photoBase documents.
 *
 * Usage:
 *   node scripts/patchPhotoBases.js [path/to/data.ndjson] [--dry-run]
 *
 * Environment variables:
 *   SANITY_PROJECT_ID   (required)
 *   SANITY_DATASET      (required)
 *   SANITY_API_TOKEN    (required – must allow mutations)
 *   SANITY_API_VERSION  (optional, defaults to 2023-10-01)
 */

const fs = require('node:fs')
const path = require('node:path')
const readline = require('node:readline')
const {createClient} = require('@sanity/client')

const ROOT = path.resolve(__dirname, '..')

const DEFAULT_DATASET_DIR = path.join(ROOT, 'export', 'extracted')
const PATCH_TITLE_PATTERN = /^q4-\d+$/
const IMAGE_SPECIFIER_PATTERN = /^image@file:\/\/\.\/images\/(.+)$/

async function main() {
  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run')
  const dataFileArg = args.find((arg) => !arg.startsWith('-'))
  const dataFile = dataFileArg || resolveLatestExtractedData()

  ensureFileExists(dataFile)

  const dataDir = path.dirname(dataFile)
  const imagesDir = path.join(dataDir, 'images')
  const assetsManifest = loadAssetsManifest(dataDir)

  const docs = await readPhotoBaseDocs(dataFile, (doc) => {
    const title = doc.title || ''
    return doc._type === 'photoBase' && PATCH_TITLE_PATTERN.test(title)
  })

  if (!docs.length) {
    console.log('No matching q4 photoBase documents found; nothing to patch.')
    return
  }

  console.log(`Prepared ${docs.length} photoBase documents from ${path.relative(ROOT, dataFile)}`)

  if (dryRun) {
    console.log('Dry run complete - not sending mutations.')
    return
  }

  const client = createClientFromEnv()
  await sendMutations(client, docs, {imagesDir, assetsManifest})

  console.log('Patch applied successfully.')
}

function resolveLatestExtractedData() {
  const candidates = fs
    .readdirSync(DEFAULT_DATASET_DIR, {withFileTypes: true})
    .filter((entry) => entry.isDirectory() && entry.name.startsWith('production-export-'))
    .map((entry) => entry.name)
    .sort()

  if (!candidates.length) {
    throw new Error(
      `No extracted export directories found under ${path.relative(ROOT, DEFAULT_DATASET_DIR)}.`,
    )
  }

  const targetDir = candidates[candidates.length - 1]
  return path.join(DEFAULT_DATASET_DIR, targetDir, 'data.ndjson')
}

function ensureFileExists(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Could not find data file at ${filePath}`)
  }
}

async function readPhotoBaseDocs(filePath, predicate) {
  const docs = []
  const stream = fs.createReadStream(filePath, {encoding: 'utf8'})
  const rl = readline.createInterface({input: stream, crlfDelay: Infinity})

  for await (const line of rl) {
    if (!line.trim()) continue
    let doc
    try {
      doc = JSON.parse(line)
    } catch (err) {
      console.warn('Skipping unparsable line:', err.message)
      continue
    }

    if (predicate(doc)) {
      const {_rev, ...rest} = doc
      docs.push(rest)
    }
  }

  return docs
}

function loadAssetsManifest(baseDir) {
  const manifestPath = path.join(baseDir, 'assets.json')
  if (!fs.existsSync(manifestPath)) {
    return {}
  }

  try {
    const raw = fs.readFileSync(manifestPath, 'utf8')
    return JSON.parse(raw)
  } catch (error) {
    throw new Error(`Failed to read assets manifest at ${manifestPath}: ${error.message}`)
  }
}

function createClientFromEnv() {
  // const {SANITY_PROJECT_ID, SANITY_DATASET, SANITY_API_TOKEN, SANITY_API_VERSION} = process.env

  // if (!SANITY_PROJECT_ID || !SANITY_DATASET || !SANITY_API_TOKEN) {
  //   throw new Error(
  //     'Missing Sanity configuration. Set SANITY_PROJECT_ID, SANITY_DATASET, and SANITY_API_TOKEN.',
  //   )
  // }

  return createClient({
    projectId: 'k3z72agi',
    dataset: 'production',
    apiVersion: '2025-10-15',
    token: '',
    useCdn: false,
    perspective: 'raw',
  })
}

async function sendMutations(client, docs, options = {}) {
  const {imagesDir, assetsManifest = {}} = options
  const assetCache = new Map()
  const needsAssets = docs.some((doc) => doc?.photo?._sanityAsset)

  if (needsAssets) {
    if (!imagesDir || !fs.existsSync(imagesDir)) {
      throw new Error(
        'One or more photoBase documents reference local image assets, but no images directory was found.',
      )
    }

    for (const doc of docs) {
      await materializePhotoAsset(client, doc, {imagesDir, assetsManifest, assetCache})
    }
  }

  const chunkSize = 50
  for (let index = 0; index < docs.length; index += chunkSize) {
    const chunk = docs.slice(index, index + chunkSize)
    const mutations = chunk.map((doc) => ({createOrReplace: doc}))
    await client.mutate(mutations, {autoGenerateArrayKeys: true})
    console.log(
      `  ✓ Applied ${Math.min(chunkSize, chunk.length)} docs (total ${index + chunk.length})`,
    )
  }
}

async function materializePhotoAsset(client, doc, context) {
  const photoField = doc?.photo
  if (!photoField || !photoField._sanityAsset) {
    return
  }

  const assetId = await ensureAssetReference(client, photoField._sanityAsset, context)

  doc.photo = {
    ...photoField,
    asset: {
      _type: 'reference',
      _ref: assetId,
    },
  }

  delete doc.photo._sanityAsset
}

async function ensureAssetReference(client, specifier, context) {
  const {imagesDir, assetsManifest, assetCache} = context
  const match = IMAGE_SPECIFIER_PATTERN.exec(specifier || '')

  if (!match) {
    throw new Error(`Unsupported image asset specifier: ${specifier}`)
  }

  const assetFilename = match[1]
  const assetPath = path.join(imagesDir, assetFilename)

  if (!fs.existsSync(assetPath)) {
    throw new Error(`Missing asset file referenced by document: ${assetPath}`)
  }

  const sha1 = assetFilename.split('-')[0]

  if (!sha1) {
    throw new Error(`Unable to derive SHA1 from asset filename: ${assetFilename}`)
  }

  if (assetCache.has(sha1)) {
    return assetCache.get(sha1)
  }

  const existing = await client.fetch('*[_type == "sanity.imageAsset" && sha1hash == $sha1][0]', {
    sha1,
  })

  if (existing && existing._id) {
    console.log(`  • Reusing existing image asset for ${assetFilename} -> ${existing._id}`)
    assetCache.set(sha1, existing._id)
    return existing._id
  }

  const manifestKey = `image-${sha1}`
  const manifestEntry = assetsManifest[manifestKey] || {}
  const uploadOptions = {
    filename: manifestEntry.originalFilename || assetFilename,
  }

  console.log(`  • Uploading ${assetFilename}`)
  const stream = fs.createReadStream(assetPath)
  const uploaded = await client.assets.upload('image', stream, uploadOptions)

  assetCache.set(sha1, uploaded._id)
  return uploaded._id
}

main().catch((error) => {
  console.error('Failed to patch photo bases:', error.message)
  process.exit(1)
})
