import {PinIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'location',
  title: 'Location',
  type: 'document',
  icon: PinIcon,
  fields: [
    {
      name: 'title',
      type: 'string',
      title: 'Title',
      validation: Rule => Rule.required().min(2).max(30)
    },
    {
      name: 'country',
      type: 'string',
      title: 'Country'
    },
    {
      name: 'flag',
      type: 'image',
      title: 'Flag'
    },
    {
      name: 'description',
      type: 'text',
      title: 'Description'
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
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

