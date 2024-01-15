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
    name: 'manufacturing',
    title: 'Manufacture',
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
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      group: 'hero',
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

    // manufacture
    defineField({
      name: 'maxUnits',
      title: 'Maximum Units',
      type: 'number',
      group: 'manufacturing',
      validation: (Rule) => Rule.positive().integer(),
    }),

    // story
    defineField({
      name: 'story',
      title: 'Story',
      type: 'body',
      group: 'story',
    }),

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
    defineField({
      name: 'store',
      title: 'Shopify',
      type: 'shopifyProduct',
      description: 'Product data from Shopify (read-only)',
      group: 'shopifySync',
    }),
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
