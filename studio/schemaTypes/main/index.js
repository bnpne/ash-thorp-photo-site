import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'main',
  title: 'Main',
  type: 'document',
  fields: [
    defineField({
      name: 'photos',
      title: 'Photos',
      type: 'array',
      of: [{type: 'reference', to: {type: 'photoBase'}}],
    }),
  ],
})
