import { groq } from 'next-sanity'

// Get all visible projects
export const projectsQuery = groq`
  *[_type == "project" && visible == true] | order(order asc, _createdAt desc) {
    _id,
    title,
    slug,
    type,
    description,
    "thumbnail": thumbnail.asset->url,
    category,
    tags,
    date
  }
`

// Get a single project by slug
export const projectBySlugQuery = groq`
  *[_type == "project" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    type,
    description,
    "thumbnail": thumbnail.asset->url,
    gallery[]{
      ...,
      "url": asset->url
    },
    videoLinks,
    vimeoUrl,
    externalLinks,
    category,
    tags,
    date,
    gridLayout,
    awardBadges[]{
      ...,
      "url": asset->url,
      alt,
      link
    },
    contentBlocks[]{
      ...,
      _type == "imageBlock" => {
        ...,
        image{
          ...,
          asset->{
            ...,
            url
          }
        }
      },
      _type == "gridBlock" => {
        ...,
        images[]{
          ...,
          asset->{
            ...,
            url
          }
        }
      },
      _type == "videoBlock" => {
        ...,
        url,
        title,
        width,
        aspectRatio
      },
      _type == "textBlock" => {
        ...,
        content,
        width
      }
    }
  }
`

// Get projects for homepage (mix of projects and experiments)
export const homepageProjectsQuery = groq`
  *[_type == "project" && visible == true] | order(order asc, _createdAt desc)[0...12] {
    _id,
    title,
    slug,
    type,
    thumbnail {
      asset->{
        url,
        mimeType
      }
    },
    category
  }
` 