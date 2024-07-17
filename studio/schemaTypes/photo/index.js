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
      name: 'slug',
      title: 'Photo Slug',
      type: 'slug',
      description:
        'A Slug is the endpoint for the photo detail page. For instance `this-photo` slug will be reached at `www.your-website.com/this-photo`. This will autogenerate based on the photo title, but can be changed. Please add a hyphen `-` instead of spaces.',
      options: {
        source: 'title',
        maxLength: 200, // will be ignored if slugify is set
        slugify: input =>
          input.toLowerCase().replace(/\s+/g, '-').slice(0, 200),
      },
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
