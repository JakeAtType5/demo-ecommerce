import {TagIcon} from '@sanity/icons'
import pluralize from 'pluralize-esm'
import {defineField, defineType} from 'sanity'

import ShopifyIcon from '../../components/icons/Shopify'
import ProductHiddenInput from '../../components/inputs/ProductHidden'
import ShopifyDocumentStatus from '../../components/media/ShopifyDocumentStatus'
import {getPriceRange} from '../../utils/getPriceRange'

const GROUPS = [
  {
    name: 'hero',
    title: 'Hero',
    default: true
  },
  {
    name: 'story',
    title: 'Story'
  },
  {
    name: 'drop',
    title: 'Drop'
  },
  {
    name: 'shopifySync',
    title: 'Shopify',
    icon: ShopifyIcon,
  },
  {
    name: 'seo',
    title: 'SEO',
  },
  {
    name: 'options',
    title: 'Options',
  },
]


export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  icon: TagIcon,
  groups: GROUPS,
  fields: [
    defineField({
      name: 'hidden',
      type: 'string',
      components: {
        field: ProductHiddenInput,
      },
      group: GROUPS.map((group) => group.name),
      hidden: ({parent}) => {
        const isActive = parent?.store?.status === 'active'
        const isDeleted = parent?.store?.isDeleted
        return !parent?.store || (isActive && !isDeleted)
      },
    }),

    // Hero
    defineField({
      name: 'printImage',
      title: 'High-res image',
      type: 'image',
      group: 'hero',
    }),
  
    // Proxies for title / artist
     defineField({
      name: 'titleProxy',
      title: 'Title',
      type: 'proxyString',
      options: {field: 'store.title'},
      group: 'hero',
    }),
    defineField({
      name: 'artistProxy',
      title: 'Artist',
      type: 'proxyString',
      options: {field: 'store.vendor'},
      group: 'hero',
    }),
  
    // description
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      group: 'hero',
    }),

    // tags
    defineField({
      name: 'tags',
      title: 'Tags',
      group: 'hero',
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
    }),

    // drop
    defineField({
      title: 'Drop',
      name: 'drop',
      group: 'drop',
      type: 'reference',
      to: [
          { type: 'drop' }
      ],
      weak: true,
      options: {
        disableNew: true,
      }
    }),

    // max units
    defineField({
      name: 'maxUnits',
      title: 'Maximum Units',
      type: 'number',
      group: 'options',
      validation: (Rule) => Rule.positive().integer(),
    }),

    // bundles
    defineField({
      name: 'bundles',
      title: 'Bundles',
      group: 'options',
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
          options: {
            filter: "store.tags == $bundle",
            filterParams: {bundle: 'Bundle'},
            sortable: false,
          }
        },
      ]
    }),

    // story
    defineField({
      name: 'story',
      title: 'Story',
      type: 'body',
      group: 'story',
    }),

    // shopify connection
    defineField({
      name: 'store',
      title: 'Shopify',
      type: 'shopifyProduct',
      description: 'Product data from Shopify (read-only)',
      group: 'shopifySync',
    }),
    // seo
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo.shopify',
      group: 'seo',
    }),
    defineField({
      name: 'slugProxy',
      title: 'Slug',
      type: 'proxyString',
      options: {field: 'store.slug.current'},
      group: 'seo',
    }),
    
    // unused
    defineField({
      name: 'body',
      title: 'Body',
      type: 'internationalizedArrayBody',
    }),
    defineField({
      name: 'creators',
      title: 'Creators',
      type: 'array',
      of: [{type: 'creator'}],
      validation: (rule) => rule.max(1),
    }),
    defineField({
      name: 'faqs',
      title: 'FAQs',
      description: 'Shown in addition to any material FAQs',
      type: 'internationalizedArrayFaqs',
    }),
  ],
  orderings: [
    {
      name: 'titleAsc',
      title: 'Title (A-Z)',
      by: [{field: 'store.title', direction: 'asc'}],
    },
    {
      name: 'titleDesc',
      title: 'Title (Z-A)',
      by: [{field: 'store.title', direction: 'desc'}],
    },
    {
      name: 'priceDesc',
      title: 'Price (Highest first)',
      by: [{field: 'store.priceRange.minVariantPrice', direction: 'desc'}],
    },
    {
      name: 'priceAsc',
      title: 'Title (Lowest first)',
      by: [{field: 'store.priceRange.minVariantPrice', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      isDeleted: 'store.isDeleted',
      options: 'store.options',
      previewImageUrl: 'store.previewImageUrl',
      priceRange: 'store.priceRange',
      status: 'store.status',
      title: 'store.title',
      variants: 'store.variants',
    },
    prepare(selection) {
      const {isDeleted, options, previewImageUrl, priceRange, status, title, variants} = selection

      const optionCount = options?.length
      const variantCount = variants?.length

      const description = [
        variantCount ? pluralize('variant', variantCount, true) : 'No variants',
        optionCount ? pluralize('option', optionCount, true) : 'No options',
      ]

      let subtitle = getPriceRange(priceRange)
      if (status !== 'active') {
        subtitle = '(Unavailable in Shopify)'
      }
      if (isDeleted) {
        subtitle = '(Deleted from Shopify)'
      }

      return {
        description: description.join(' / '),
        subtitle,
        title,
        media: (
          <ShopifyDocumentStatus
            isActive={status === 'active'}
            isDeleted={isDeleted}
            type="product"
            url={previewImageUrl}
            title={title}
          />
        ),
      }
    },
  },
})
