import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schema} from './sanity/schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Nico Phipps Portfolio',

  projectId: 'i7xs293k',
  dataset: 'production',

  plugins: [structureTool(), visionTool()],

  schema: schema,

  basePath: '/studio',
}) 