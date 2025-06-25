export default {
  name: 'project',
  title: 'Projects',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'type',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          { title: 'Project', value: 'project' },
          { title: 'Experiment', value: 'experiment' }
        ]
      },
      initialValue: 'project',
      validation: Rule => Rule.required()
    },
    {
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'H3', value: 'h3'},
            {title: 'H4', value: 'h4'},
            {title: 'Quote', value: 'blockquote'}
          ],
          marks: {
            decorators: [
              {title: 'Bold', value: 'strong'},
              {title: 'Italic', value: 'em'},
              {title: 'Underline', value: 'underline'}
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'External link',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL'
                  },
                  {
                    title: 'Open in new tab',
                    name: 'blank',
                    type: 'boolean',
                    initialValue: true
                  }
                ]
              }
            ]
          }
        }
      ]
    },
    {
      name: 'thumbnail',
      title: 'Thumbnail (Image or Video)',
      type: 'file',
      options: {
        accept: 'image/*, video/*'
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Important for SEO and accessibility'
        },
        {
          name: 'caption',
          type: 'string',
          title: 'Caption'
        }
      ],
      validation: Rule => Rule.required()
    },
    {
      name: 'gallery',
      title: 'Image Gallery',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative text',
              validation: Rule => Rule.required()
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption'
            }
          ]
        },
        {
          type: 'object',
          name: 'externalImage',
          title: 'External Image',
          fields: [
            {
              name: 'url',
              type: 'url',
              title: 'Image URL',
              validation: Rule => Rule.required()
            },
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative text',
              validation: Rule => Rule.required()
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption'
            }
          ]
        }
      ]
    },
    {
      name: 'vimeoUrl',
      title: 'Vimeo Embed URL',
      type: 'url',
      description: 'Full Vimeo URL (e.g., https://vimeo.com/123456789)',
      validation: Rule => Rule.uri({
        scheme: ['http', 'https']
      })
    },
    {
      name: 'externalLinks',
      title: 'External Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'label',
              title: 'Link Label',
              type: 'string',
              description: 'e.g., "View live site", "Read article"',
              validation: Rule => Rule.required()
            },
            {
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: Rule => Rule.required()
            },
            {
              name: 'openInNewTab',
              title: 'Open in new tab',
              type: 'boolean',
              initialValue: true
            }
          ],
          preview: {
            select: {
              title: 'label',
              subtitle: 'url'
            }
          }
        }
      ]
    },
    {
      name: 'visible',
      title: 'Visible',
      type: 'boolean',
      description: 'Set to true to show this project on the site',
      initialValue: false
    },
    {
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Used to control the order of projects (lower numbers appear first)',
      initialValue: 0
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Website', value: 'website'},
          {title: 'Brand Campaign', value: 'brand-campaign'},
          {title: 'Vibe Coding', value: 'vibe-coding'},
          {title: 'Brand & Content Development', value: 'brand-content-development'},
          {title: 'Experiential', value: 'experiential'},
          {title: 'Video Series', value: 'video-series'},
          {title: 'Other', value: 'other'}
        ]
      }
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
      name: 'date',
      title: 'Project Date',
      type: 'datetime',
      description: 'When the project was completed',
      initialValue: () => new Date().toISOString()
    },
    {
      name: 'collaborators',
      title: 'Collaborators',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'person'}]
        }
      ]
    }
  ],
  preview: {
    select: {
      title: 'title',
      media: 'thumbnail',
      subtitle: 'category',
      type: 'type',
      visible: 'visible'
    },
    prepare({title, media, subtitle, type, visible}) {
      const typeEmoji = type === 'experiment' ? '🧪' : '💼'
      return {
        title: `${typeEmoji} ${title} ${!visible ? '(Hidden)' : ''}`,
        media,
        subtitle
      }
    }
  },
  orderings: [
    {
      title: 'Manual order',
      name: 'manualOrder',
      by: [
        {field: 'order', direction: 'asc'},
        {field: 'title', direction: 'asc'}
      ]
    },
    {
      title: 'Project Date, New First',
      name: 'dateDesc',
      by: [
        {field: 'date', direction: 'desc'}
      ]
    },
    {
      title: 'Type',
      name: 'type',
      by: [
        {field: 'type', direction: 'asc'},
        {field: 'order', direction: 'asc'}
      ]
    }
  ]
} 