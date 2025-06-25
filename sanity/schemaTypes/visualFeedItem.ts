export default {
  name: 'visualFeedItem',
  title: 'Visual Feed Item',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Internal title for organization (not shown on site)',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'media',
      title: 'Media (Image or GIF)',
      type: 'file',
      options: {
        accept: 'image/*'
      },
      validation: (Rule: any) => Rule.required(),
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Important for SEO and accessibility',
          validation: (Rule: any) => Rule.required()
        }
      ]
    },
    {
      name: 'videoUrl',
      title: 'Video URL (Optional)',
      type: 'url',
      description: 'For Vimeo or YouTube videos. Use this instead of uploading video files.',
      validation: (Rule: any) => Rule.uri({
        scheme: ['http', 'https']
      })
    },
    {
      name: 'aspectRatio',
      title: 'Aspect Ratio',
      type: 'string',
      description: 'How the item should be displayed in the masonry grid',
      options: {
        list: [
          {title: 'Square (1:1)', value: 'square'},
          {title: 'Portrait (3:4)', value: 'portrait'},
          {title: 'Tall (2:3)', value: 'tall'},
          {title: 'Vertical (9:16)', value: 'vertical'},
          {title: 'Wide (4:3)', value: 'wide'},
          {title: 'Ultrawide (16:9)', value: 'ultrawide'}
        ],
        layout: 'radio'
      },
      initialValue: 'portrait'
    },
    {
      name: 'caption',
      title: 'Caption',
      type: 'string',
      description: 'Short caption shown below the image',
      validation: (Rule: any) => Rule.max(100)
    },
    {
      name: 'projectReference',
      title: 'Related Project',
      type: 'reference',
      to: [{type: 'project'}],
      description: 'Optional: Link this to a project'
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        layout: 'tags'
      }
    },
    {
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Used to control the order (lower numbers appear first)',
      initialValue: 0
    },
    {
      name: 'visible',
      title: 'Visible',
      type: 'boolean',
      description: 'Set to true to show on the visual feed',
      initialValue: true
    }
  ],
  preview: {
    select: {
      title: 'caption',
      subtitle: 'title',
      media: 'media',
      visible: 'visible'
    },
    prepare({title, subtitle, media, visible}: any) {
      return {
        title: title || subtitle,
        subtitle: `${subtitle} ${!visible ? '(Hidden)' : ''}`,
        media
      }
    }
  },
  orderings: [
    {
      title: 'Manual order',
      name: 'manualOrder',
      by: [
        {field: 'order', direction: 'asc'},
        {field: '_createdAt', direction: 'desc'}
      ]
    },
    {
      title: 'Newest first',
      name: 'createdDesc',
      by: [
        {field: '_createdAt', direction: 'desc'}
      ]
    }
  ]
} 