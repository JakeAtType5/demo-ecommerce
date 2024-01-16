import {defineField, defineType} from 'sanity'

const GROUPS = [
  {
    name: 'content',
    title: 'Content',
    default: true
  },
  {
    name: 'video',
    title: 'Video',
  },
  {
    name: 'seo',
    title: 'SEO',
  },
]

export default defineType({
  name: 'episode',
  title: 'Episode',
  type: 'document',
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
   
    // Video
    {
      title: 'Video file',
      name: 'video',
      group: 'video',
      type: 'mux.video',
    },
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
