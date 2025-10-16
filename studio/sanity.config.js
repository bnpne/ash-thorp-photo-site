import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {deskStructure} from './deskStructure'
import {media} from 'sanity-plugin-media'
import {vercelDeployTool} from 'sanity-plugin-vercel-deploy'

export default defineConfig({
  name: 'default',
  title: 'ash-thorp-photo',

  projectId: 'k3z72agi',
  dataset: 'production',

  plugins: [structureTool({structure: deskStructure}), visionTool(), media(), vercelDeployTool()],

  schema: {
    types: schemaTypes,
  },
})
