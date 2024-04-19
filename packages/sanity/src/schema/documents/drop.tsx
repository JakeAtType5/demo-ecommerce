import {TagIcon} from '@sanity/icons'
import {defineType} from 'sanity'

const GROUPS = [
  {
    name: 'content',
    title: 'Content',
    default: true
  },
  {
    name: 'prints',
    title: 'Products'
  },
  {
    name: 'episode',
    title: 'Episode'
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
      name: 'message',
      type: 'string',
      group: 'content',
      title: 'Banner Message'
    },
    {
      name: 'location',
      type: 'string',
      group: 'content',
      title: 'Location'
    },
    {
        name: 'tags',
        title: 'Tags',
        group: 'content',
        type: 'array',
        of: [
          {
            type: 'reference',
            name: 'styles',
            title: 'Styles',
            to: [
              {
                type: 'style',
              },
            ],
            weak: true
          },
          {
            type: 'reference',
            name: 'colours',
            title: 'Colours',
            to: [
              {
                type: 'colour',
              },
            ],
            weak: true
          },
          {
            type: 'reference',
            name: 'locations',
            title: 'Locations',
            to: [
              {
                type: 'location',
              },
            ],
            weak: true
          },
        ]
      },
      {
        name: 'gallery',
        title: 'Gallery',
        type: 'body',
        group: 'content',
      },
      {
        name: 'notes',
        type: 'simpleBlockContent',
        group: 'content',
        title: 'Curator Notes'
      },
      {
        name: 'credits',
        type: 'simpleBlockContent',
        group: 'content',
        title: 'Credits'
      },
    
    // video
    {
      title: 'Video file',
      name: 'video',
      group: 'episode',
      type: 'mux.video',
    },

    // Products
    {
      title: 'Products',
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
    },

    // SEO
    {
      name: 'seo',
      title: 'SEO',
      type: 'seo.page',
      group: 'seo',
    },
    {
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
    },
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

