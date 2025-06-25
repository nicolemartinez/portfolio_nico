import { type SchemaTypeDefinition } from 'sanity'
import project from './project'
import visualFeedItem from './visualFeedItem'
import aboutPage from './aboutPage'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [project, visualFeedItem, aboutPage],
}
