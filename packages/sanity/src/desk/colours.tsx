import {ColorWheelIcon} from '@sanity/icons'
import {ListItemBuilder} from 'sanity/desk'

import defineStructure from '../utils/defineStructure'
import {previewPane} from './preview'

export default defineStructure<ListItemBuilder>((S) =>
S.listItem()
  .title('Colours')
  .schemaType('colour')
  .icon(ColorWheelIcon)
  .child(
    S.documentTypeList('colour')
      .child(async (id) =>
        S.document()
        .schemaType('colour')
        .documentId(id)
        .views([S.view.form(), previewPane(S)])
        )
  )
)
