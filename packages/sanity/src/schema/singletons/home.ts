import {HomeIcon} from '@sanity/icons'
import {defineField} from 'sanity'

const TITLE = 'Home'

export default defineField({
  name: 'home',
  title: TITLE,
  type: 'document',
  icon: HomeIcon,
  groups: [
    {
      default: true,
      name: 'hero',
      title: 'Hero',
    },
    {
      name: 'faqs',
      title: 'FAQs',
    },
    {
      name: 'seo',
      title: 'SEO',
    },
  ],
  fields: [
    // Hero
    defineField({
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
      group: 'hero',
    }),
    defineField({
      name: 'faqs',
      title: 'FAQS',
      type: 'faqs',
      group: 'faqs',
    }),

    // SEO
    defineField({
      name: 'seo',
      title: 'SEO',
      type: 'seo.home',
      group: 'seo',
    }),
    defineField({
      name: 'language',
      title: 'Language',
      type: 'string',
      hidden: true,
    }),
  ],
  preview: {
    select: {
      language: 'language',
    },
    prepare({language}) {
      return {
        title: TITLE,
        subtitle: language.toUpperCase(),
      }
    },
  },
})
