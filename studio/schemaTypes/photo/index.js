import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'photoBase',
  title: 'Photo',
  type: 'document',
  fields: [
    defineField({
      name: 'photo',
      title: 'Photo',
      type: 'image',
      options: {
        metadata: ['exif', 'palette', 'location'],
        storeOriginalFilename: true,
      },
      validation: r => r.required(),
    }),
    defineField({
      name: 'title',
      title: 'Photo Title',
      type: 'string',
    }),
    defineField({
      name: 'snippet',
      title: 'Photo Snippet',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'audio',
      title: 'Audio File',
      type: 'file',
    }),
  ],
})
