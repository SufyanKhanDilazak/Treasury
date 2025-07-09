import { defineField, defineType } from 'sanity';

export const product = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Product Name',
      type: 'string',
      validation: (Rule) => Rule.required().min(2).max(100)
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
        slugify: (input) => input.toLowerCase().replace(/\s+/g, '-').slice(0, 96)
      },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
      validation: (Rule) => Rule.required().min(0)
    }),
    defineField({
      name: 'images',
      title: 'Product Images',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true
          }
        }
      ],
      validation: (Rule) => Rule.required().min(1).max(10).warning('At least 1 image required, maximum 10 recommended')
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4
    }),
    defineField({
      name: 'onSale',
      title: 'On Sale',
      type: 'boolean',
      initialValue: false
    }),
    defineField({
      name: 'newArrival',
      title: 'New Arrival',
      type: 'boolean',
      initialValue: false
    }),
    defineField({
      name: 'inStock',
      title: 'Stock Status',
      type: 'boolean',
      initialValue: true,
      description: 'Toggle to set In Stock (true) or Out of Stock (false)'
    }),
    defineField({
      name: 'volume',
      title: 'Volume (ML)',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Available volumes in ML (e.g., 5, 10, 50, 100)',
      validation: (Rule) => Rule.min(1).warning('At least one volume option recommended')
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'category' }] }],
      validation: (Rule) => Rule.max(2).warning('Maximum 2 categories recommended')
    })
  ],
  preview: {
    select: {
      title: 'name',
      media: 'images.0',
      subtitle: 'price'
    },
    prepare({ title, media, subtitle }) {
      return {
        title,
        media,
        subtitle: `PKR ${subtitle}`
      };
    }
  }
});