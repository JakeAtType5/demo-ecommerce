import {TagIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

const GROUPS = [
  {
    name: 'content',
    title: 'Content',
    default: true
  },
  {
    name: 'prints',
    title: 'Prints'
  },
  {
    name: 'seo',
    title: 'SEO',
  },
]

export default defineType({
  name: 'drop',
  title: 'Drop',
  type: 'document',
  icon: TagIcon,
  groups: GROUPS,
  fields: [
    // Content
    {
      name: 'title',
      type: 'string',
      group: 'content',
      title: 'Title',
      validation: Rule => Rule.required().min(6).max(40)
    },
    {
      name: 'number',
      type: 'number',
      group: 'content',
      title: 'Number',
      validation: Rule => Rule.required()
    },
    {
      name: 'description',
      type: 'text',
      group: 'content',
      title: 'Description'
    },
    {
      name: 'release_date',
      type: 'datetime',
      group: 'content',
      title: 'Release Date'
    },
    {
      name: 'location',
      type: 'string',
      group: 'content',
      title: 'Location'
    },
    // Prints
    defineField({
      title: 'Prints',
      name: 'prints',
      group: 'prints',
      type: 'array',
      of: [
        {
          type: 'reference',
          title: 'Products',
          to: [
            {
              type: 'product',
            },
          ],
        },
      ],
      validation: (Rule) => Rule.max(6),
    }),

    // SEO
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo.page',
      group: 'seo',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'seo',
      options: {
        source: 'title',
        slugify: input => input
          .toLowerCase()
          .replace(/\s+/g, '-')
          .slice(0, 200)
      }
    }),
  ],

  // orderings: [
  //   {
  //     name: 'titleAsc',
  //     title: 'Title (A-Z)',
  //     by: [{field: 'store.title', direction: 'asc'}],
  //   },
  //   {
  //     name: 'titleDesc',
  //     title: 'Title (Z-A)',
  //     by: [{field: 'store.title', direction: 'desc'}],
  //   },
  //   {
  //     name: 'priceDesc',
  //     title: 'Price (Highest first)',
  //     by: [{field: 'store.priceRange.minVariantPrice', direction: 'desc'}],
  //   },
  //   {
  //     name: 'priceAsc',
  //     title: 'Title (Lowest first)',
  //     by: [{field: 'store.priceRange.minVariantPrice', direction: 'asc'}],
  //   },
  // ],
  // preview: {
  //   select: {
  //     isDeleted: 'store.isDeleted',
  //     options: 'store.options',
  //     previewImageUrl: 'store.previewImageUrl',
  //     priceRange: 'store.priceRange',
  //     status: 'store.status',
  //     title: 'store.title',
  //     variants: 'store.variants',
  //   },
  //   prepare(selection) {
  //     const {isDeleted, options, previewImageUrl, priceRange, status, title, variants} = selection

  //     const optionCount = options?.length
  //     const variantCount = variants?.length

  //     const description = [
  //       variantCount ? pluralize('variant', variantCount, true) : 'No variants',
  //       optionCount ? pluralize('option', optionCount, true) : 'No options',
  //     ]

  //     let subtitle = getPriceRange(priceRange)
  //     if (status !== 'active') {
  //       subtitle = '(Unavailable in Shopify)'
  //     }
  //     if (isDeleted) {
  //       subtitle = '(Deleted from Shopify)'
  //     }

  //     return {
  //       description: description.join(' / '),
  //       subtitle,
  //       title,
  //       media: (
  //         <ShopifyDocumentStatus
  //           isActive={status === 'active'}
  //           isDeleted={isDeleted}
  //           type="product"
  //           url={previewImageUrl}
  //           title={title}
  //         />
  //       ),
  //     }
  //   },
  // },
})



// {
//   name: 'linkedVideo',
//   type: 'reference',
//   group: 'context',
//   title: 'Video',
//   to: [
//     { type: 'video' }
//   ],
//   weak: true,
//   options: {
//     disableNew: true,
//   }
// },