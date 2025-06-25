import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: 'i7xs293k',
  dataset: 'production',
  apiVersion: '2024-01-01',
  useCdn: false, // Set to false for fresh data in development
}) 