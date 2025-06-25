export default {
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  fields: [
    {
      name: 'bio',
      title: 'Biography',
      type: 'array',
      description: 'Your bio text - supports multiple paragraphs, formatting, and links',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'H2', value: 'h2'},
            {title: 'H3', value: 'h3'},
            {title: 'Quote', value: 'blockquote'}
          ],
          marks: {
            decorators: [
              {title: 'Bold', value: 'strong'},
              {title: 'Italic', value: 'em'}
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
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
      validation: (Rule: any) => Rule.email()
    },
    {
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          {
            name: 'platform',
            title: 'Platform',
            type: 'string',
            options: {
              list: [
                {title: 'Instagram', value: 'instagram'},
                {title: 'LinkedIn', value: 'linkedin'},
                {title: 'Twitter', value: 'twitter'},
                {title: 'Behance', value: 'behance'},
                {title: 'Dribbble', value: 'dribbble'},
                {title: 'Other', value: 'other'}
              ]
            }
          },
          {
            name: 'url',
            title: 'URL',
            type: 'url',
            validation: (Rule: any) => Rule.required()
          },
          {
            name: 'label',
            title: 'Display Label',
            type: 'string',
            description: 'How the link should appear (e.g., "Instagram", "LinkedIn")'
          }
        ],
        preview: {
          select: {
            title: 'label',
            subtitle: 'platform'
          }
        }
      }]
    }
  ],
  preview: {
    select: {
      title: 'title'
    },
    prepare() {
      return {
        title: 'About Page'
      }
    }
  }
} 