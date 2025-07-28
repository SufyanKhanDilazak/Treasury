import { defineField, defineType } from 'sanity'

const customSlugify = (input: string) => {
  const slugMap: { [key: string]: string } = {
    'summer': 'summer',
    'men': 'men',
    'women': 'women',
    'office': 'office',
    'oudh': 'oudh',
    'banner': 'banner',
  };
  return slugMap[input] || input.toLowerCase().replace(/\s+/g, '-');
};

export const categorySchema = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Category Name',
      type: 'string',
      options: {
        list: [
          { title: 'SUMMER', value: 'summer' },
          { title: 'MEN', value: 'men' },
          { title: 'WOMEN', value: 'women' },
          { title: 'OFFICE', value: 'office' },
          { title: 'OUDH', value: 'oudh' },
          { title: 'BANNER', value: 'banner' }
        ],
        layout: 'dropdown'
      },
      initialValue: 'summer',
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        slugify: customSlugify,
      },
      validation: (Rule) => Rule.required()
    }),
    defineField({
      name: 'categoryBanner',
      title: 'Category Banner',
      type: 'image',
      options: {
        hotspot: true
      },
      description: 'Banner image for the category page'
    }),
    defineField({
      name: 'bannerImage',
      title: 'Banner Image',
      type: 'image',
      options: {
        hotspot: true
      },
      description: 'Main banner image (used specifically for banner category)',
      hidden: ({ document }) => document?.title !== 'banner'
    })
  ]
})