import {PinIcon} from '@sanity/icons'
import {ListItemBuilder} from 'sanity/desk'

import defineStructure from '../utils/defineStructure'
import {previewPane} from './preview'

export default defineStructure<ListItemBuilder>((S) =>
S.listItem()
  .title('Locations')
  .schemaType('location')
  .icon(PinIcon)
  .child(
    S.documentTypeList('location')
      .child(async (id) =>
        S.document()
        .schemaType('location')
        .documentId(id)
        .views([S.view.form(), previewPane(S)])
        )
  )
)
