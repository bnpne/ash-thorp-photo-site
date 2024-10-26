import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'main',
  title: 'Main',
  type: 'document',
  fields: [
    defineField({
      name: 'collections',
      title: 'Collections',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'collection',
          title: 'Collection',
          fields: [
            defineField({
              title: 'Collection Title',
              name: 'title',
              type: 'string',
              validation: (r) => r.required(),
            }),
            defineField({
              name: 'photos',
              title: 'Photos',
              type: 'array',
              of: [{type: 'reference', to: {type: 'photoBase'}}],
            }),
          ],
        },
      ],
    }),
  ],
})
