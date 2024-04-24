import {BlockElementIcon} from '@sanity/icons'
import {defineField} from 'sanity'

export default defineField({
  title: 'Separator',
  name: 'separator',
  icon: BlockElementIcon,
  type: 'object'
  // preview: {
  //   select: {
  //     title: 'title',
  //     url: 'url',
  //   },
  //   prepare(selection) {
  //     const {title, url} = selection
  //     const subtitle = []
  //     if (url) {
  //       subtitle.push(`→ ${url}`)
  //     }
  //     return {
  //       // media: image,
  //       subtitle: subtitle.join(' '),
  //       title,
  //     }
  //   },
  // },
  ,
  fields: [{
    title: 'Name',
    name: 'name',
    type: 'string',
  }]
})
