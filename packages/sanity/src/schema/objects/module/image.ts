import {ImageIcon} from '@sanity/icons'
import {defineField} from 'sanity'

const VARIANTS = [
  {title: 'Simple', value: undefined},
  {title: 'Caption', value: 'caption'},
  {title: 'Quote', value: 'quote'},
  {title: 'Text', value: 'text'},
  {title: 'Quote & Text', value: 'quoteAndText'},
  {title: 'Product hotspots', value: 'productHotspots'},
  {title: 'Call to action', value: 'callToAction'}
]

const SIZES = [
  {title: 'Full Width', value: 'fullWidth'},
  {title: 'Half Width', value: 'halfWidth'}
]

const POSITIONS = [
  {title: 'Left', value: 'left'},
  {title: 'Center', value: 'center'},
  {title: 'Right', value: 'right'}
]

const DIRECTIONS = [
  {title: 'Left of image', value: 'leftOfImage'},
  {title: 'Center aligned', value: 'centered'},
  {title: 'Right of image', value: 'rightOfImage'}
]

export default defineField({
  name: 'module.image',
  title: 'Image',
  type: 'object',
  icon: ImageIcon,
  fields: [
    // Image
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      validation: (rule) => rule.required(),
    }),
    // Variant
    defineField({
      name: 'variant',
      title: 'Variant',
      type: 'string',
      options: {
        direction: 'horizontal',
        layout: 'radio',
        list: VARIANTS,
      },
      initialValue: undefined,
    }),
     // Size
     defineField({
      name: 'size',
      title: 'Size',
      type: 'string',
      options: {
        direction: 'horizontal',
        layout: 'radio',
        list: SIZES,
      },
      initialValue: undefined
    }),
    // Image position
    defineField({
      name: 'position',
      title: 'Image Position',
      type: 'string',
      options: {
        direction: 'horizontal',
        layout: 'radio',
        list: POSITIONS,
      },
      hidden: ({parent}) => parent.size !== 'halfWidth',
    }),
    // Content position
    defineField({
      name: 'contentPosition',
      title: 'Content Direction',
      type: 'string',
      options: {
        direction: 'horizontal',
        layout: 'radio',
        list: DIRECTIONS,
      },
    }),
    // Caption
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'text',
      rows: 2,
      hidden: ({parent}) => parent.variant !== 'caption',
    }),
    // Text
    defineField({
      name: 'text',
      title: 'Text',
      type: 'text',
      rows: 2,
      hidden: ({parent}) => parent.variant !== 'text' && parent.variant !== 'quoteAndText',
    }),
    // Quote
    defineField({
      name: 'quote',
      title: 'Quote',
      type: 'text',
      rows: 1,
      hidden: ({parent}) => parent.variant !== 'quote' && parent.variant !== 'quoteAndText',
    }),
    // Call to action
    defineField({
      name: 'callToAction',
      title: 'Call to action',
      type: 'object',
      fields: [
        // Title
        {
          name: 'title',
          title: 'Title',
          type: 'string',
        },
        // Link
        {
          name: 'links',
          title: 'Link',
          type: 'array',
          of: [{type: 'linkInternal'}, {type: 'linkExternal'}],
          validation: (rule) => rule.max(1),
        },
      ],
      hidden: ({parent}) => parent.variant !== 'callToAction',
    }),
    // Product hotspots
    defineField({
      name: 'productHotspots',
      title: 'Hotspots',
      type: 'productHotspots',
      hidden: ({parent}) => parent.variant !== 'productHotspots',
    }),
    // Product tags
    defineField({
      name: 'productTags',
      title: 'Products',
      type: 'array',
      hidden: ({parent}) => parent.variant !== 'productTags',
      of: [
        {
          name: 'productWithVariant',
          title: 'Product + Variant',
          type: 'productWithVariant',
        },
      ],
    }),
  ],
  preview: {
    select: {
      fileName: 'image.asset.originalFilename',
      image: 'image',
      size: 'size',
      position: 'position',
      variant: 'variant'
    },
    prepare(selection) {
      const {fileName, image, variant, size, position} = selection
      const currentVariant = VARIANTS.find((v) => v.value === variant)

      return {
        media: image,
        subtitle: 'Image' + (currentVariant ? ` / ${currentVariant.title}` : '') + ` / ${size}` + ` / ${position}`,
        title: fileName,
      }
    },
  },
})
