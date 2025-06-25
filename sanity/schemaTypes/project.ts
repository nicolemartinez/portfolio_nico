export default {
  name: 'project',
  title: 'Projects',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required()
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
      validation: (Rule: any) => Rule.required()
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
      validation: (Rule: any) => Rule.required()
    },
    {
      name: 'thumbnailRatio',
      title: 'Thumbnail Focus Area',
      type: 'string',
      description: 'Images always fill the grid space. This controls which part of the image to prioritize when cropping.',
      options: {
        list: [
          {title: 'Center (default)', value: 'original'},
          {title: 'Square crop (1:1) - center', value: '1:1'},
          {title: 'Wide crop (16:9) - center', value: '16:9'},
          {title: 'Classic crop (4:3) - center', value: '4:3'},
          {title: 'Portrait crop (3:4) - top', value: '3:4'}
        ],
        layout: 'radio'
      },
      initialValue: 'original'
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
              validation: (Rule: any) => Rule.required()
            },
            {
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (Rule: any) => Rule.required()
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
          {title: 'Video Series or Film', value: 'video-series'},
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
      name: 'awardBadges',
      title: 'Award Badges',
      type: 'array',
      description: 'Add award badges (e.g., Webby Award, Site of the Day)',
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
              description: 'e.g., "Webby Award Winner 2024"',
              validation: (Rule: any) => Rule.required()
            },
            {
              name: 'link',
              type: 'url',
              title: 'Award Link',
              description: 'Link to the award page (optional)'
            }
          ]
        }
      ],
      validation: (Rule: any) => Rule.max(2).error('Maximum 2 award badges allowed')
    },
    {
      name: 'date',
      title: 'Project Date',
      type: 'datetime',
      description: 'When the project was completed',
      initialValue: () => new Date().toISOString()
    },
    {
      name: 'contentBlocks',
      title: 'Content Blocks',
      type: 'array',
      description: 'Build your project detail page with flexible content blocks',
      of: [
        {
          type: 'object',
          name: 'textBlock',
          title: 'Text Block',
          fields: [
            {
              name: 'content',
              title: 'Content',
              type: 'array',
              of: [{type: 'block'}]
            },
            {
              name: 'width',
              title: 'Width',
              type: 'string',
              options: {
                list: [
                  {title: 'Small (1 column)', value: 'small'},
                  {title: 'Medium (2 columns)', value: 'medium'},
                  {title: 'Large (3 columns)', value: 'large'},
                  {title: 'Full Width', value: 'full'}
                ]
              },
              initialValue: 'medium'
            }
          ],
          preview: {
            select: {
              blocks: 'content'
            },
            prepare(value: any) {
              const block = (value.blocks || []).find((block: any) => block._type === 'block')
              return {
                title: block
                  ? block.children
                    .filter((child: any) => child._type === 'span')
                    .map((span: any) => span.text)
                    .join('')
                    .slice(0, 60) + '...'
                  : 'Text Block'
              }
            }
          }
        },
        {
          type: 'object',
          name: 'imageBlock',
          title: 'Image Block',
          fields: [
            {
              name: 'image',
              title: 'Image',
              type: 'image',
              options: {
                hotspot: true
              },
              validation: (Rule: any) => Rule.required()
            },
            {
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
              validation: (Rule: any) => Rule.required()
            },
            {
              name: 'caption',
              title: 'Caption',
              type: 'string'
            },
            {
              name: 'width',
              title: 'Width',
              type: 'string',
              options: {
                list: [
                  {title: 'Small (1 column)', value: 'small'},
                  {title: 'Medium (2 columns)', value: 'medium'},
                  {title: 'Large (3 columns)', value: 'large'},
                  {title: 'Full Width', value: 'full'}
                ]
              },
              initialValue: 'medium'
            },
            {
              name: 'aspectRatio',
              title: 'Aspect Ratio',
              type: 'string',
              description: 'Control the aspect ratio of the image (only applies to small width images in masonry)',
              options: {
                list: [
                  {title: 'Natural (default)', value: 'natural'},
                  {title: 'Square (1:1)', value: '1:1'},
                  {title: 'Portrait (3:4)', value: '3:4'},
                  {title: 'Tall Portrait (2:3)', value: '2:3'},
                  {title: 'Vertical (9:16)', value: '9:16'},
                  {title: 'Classic (4:3)', value: '4:3'},
                  {title: 'Wide (16:9)', value: '16:9'}
                ]
              },
              initialValue: 'natural'
            }
          ],
          preview: {
            select: {
              media: 'image',
              title: 'alt'
            }
          }
        },
        {
          type: 'object',
          name: 'videoBlock',
          title: 'Video Block',
          fields: [
            {
              name: 'url',
              title: 'Video URL',
              type: 'url',
              description: 'Vimeo, YouTube, or other video URL',
              validation: (Rule: any) => Rule.required()
            },
            {
              name: 'title',
              title: 'Title',
              type: 'string'
            },
            {
              name: 'width',
              title: 'Width',
              type: 'string',
              options: {
                list: [
                  {title: 'Small (1 column)', value: 'small'},
                  {title: 'Medium (2 columns)', value: 'medium'},
                  {title: 'Large (3 columns)', value: 'large'},
                  {title: 'Full Width', value: 'full'}
                ]
              },
              initialValue: 'medium'
            },
            {
              name: 'aspectRatio',
              title: 'Aspect Ratio',
              type: 'string',
              options: {
                list: [
                  {title: '16:9', value: '16:9'},
                  {title: '4:3', value: '4:3'},
                  {title: '4:5', value: '4:5'},
                  {title: '1:1', value: '1:1'},
                  {title: '9:16', value: '9:16'}
                ]
              },
              initialValue: '16:9'
            }
          ],
          preview: {
            select: {
              title: 'title',
              url: 'url'
            },
            prepare({title, url}: any) {
              return {
                title: title || 'Video Block',
                subtitle: url
              }
            }
          }
        },
        {
          type: 'object',
          name: 'gridBlock',
          title: 'Image Grid Block',
          fields: [
            {
              name: 'images',
              title: 'Images',
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
                      validation: (Rule: any) => Rule.required()
                    }
                  ]
                }
              ],
              validation: (Rule: any) => Rule.min(2).max(9)
            },
            {
              name: 'columns',
              title: 'Columns',
              type: 'number',
              options: {
                list: [2, 3, 4]
              },
              initialValue: 3
            }
          ],
          preview: {
            select: {
              images: 'images'
            },
            prepare({images}: any) {
              return {
                title: 'Image Grid',
                subtitle: `${images?.length || 0} images`
              }
            }
          }
        }
      ]
    },
    {
      name: 'gridSize',
      title: 'Grid Size',
      type: 'string',
      description: 'Choose the width in the grid',
      options: {
        list: [
          {title: 'Square (1 column)', value: 'square'},
          {title: 'Wide (2 columns)', value: 'wide'},
          {title: 'Full Width (3 columns)', value: 'full'}
        ],
        layout: 'radio'
      },
      initialValue: 'square'
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
    prepare({title, media, subtitle, type, visible}: any) {
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