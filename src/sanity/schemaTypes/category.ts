import { defineField, defineType } from 'sanity'

const customSlugify = (input: string): string => {
  // Back-compat so old values don't break if they exist
  const map: Record<string, string> = {
    'clutch-bags': 'clutch',
    'Clutch Bags': 'clutch',
    'Clutch': 'clutch',
    'bag-collection': 'bag-showcase',
    'perfume-collection': 'perfume-showcase',
    'footwear-collection': 'footwear-showcase',
    // legacy men/women (ignored now)
    men_collection: 'bag-showcase',
    women_collection: 'perfume-showcase',
    men_showcase: 'bag-showcase',
    women_showcase: 'perfume-showcase',
  }

  const normalized = String(input).trim()
  if (map[normalized]) return map[normalized]

  return normalized
    .toLowerCase()
    .replace(/[—–−]/g, '-')   // normalize dash variants
    .replace(/[\s_]+/g, '-')  // spaces/underscores -> dash
    .replace(/[^\w-]+/g, '')  // keep a-z0-9 and dash
    .replace(/-+/g, '-')      // collapse multiple dashes
    .replace(/^-+|-+$/g, '')  // trim
}

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
        // ===== EXACTLY LIKE YOUR NAVBAR =====
        list: [
          // ---- SHOWCASES ONLY ----
          { title: 'Bag Showcase', value: 'bag-showcase' },
          { title: 'Perfume Showcase', value: 'perfume-showcase' },
          { title: 'Footwear Showcase', value: 'footwear-showcase' },

          // ---- BAGS ----
          { title: 'Clutch', value: 'clutch' }, // label "Clutch" (not "Clutch Bags")
          { title: 'Tote Bags', value: 'tote-bags' },
          { title: 'Shoulder Bags', value: 'shoulder-bags' },
          { title: 'Crossbody Bags', value: 'crossbody-bags' },
          { title: 'Top Handle Bags', value: 'top-handle-bags' },

          // ---- PERFUMES ----
          { title: 'Unisex Perfumes', value: 'unisex-perfumes' },
          { title: 'Perfume Kits', value: 'perfume-kits' },

          // ---- FOOTWEAR ----
          { title: 'Heels', value: 'heels' },
          { title: 'Flats', value: 'flats' },
        ],
        layout: 'dropdown',
      },
      initialValue: 'bag-showcase',
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',            // stores the list "value" (already slug-like)
        slugify: customSlugify,     // normalizes legacy inputs if any
        maxLength: 96,
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
      validation: (Rule) =>
        Rule.required().custom((slug) => {
          if (!slug?.current) return 'Slug is required'
          const ok = /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug.current)
          return ok ? true : 'Slug must contain only lowercase letters, numbers, and hyphens (no consecutive hyphens)'
        }),
    }),
  ],
  preview: {
    select: { title: 'title', slug: 'slug' },
    prepare({ title, slug }) {
      return {
        title, // shows stored value (e.g., "unisex-perfumes", "bag-showcase")
        subtitle: slug?.current ? `/${slug.current}` : 'No slug',
      }
    },
  },
})
