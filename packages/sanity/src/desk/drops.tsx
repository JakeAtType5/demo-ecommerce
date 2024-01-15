import {CalendarIcon} from '@sanity/icons'
import {ListItemBuilder} from 'sanity/desk'

import defineStructure from '../utils/defineStructure'
import {previewPane} from './preview'

export default defineStructure<ListItemBuilder>((S) =>
S.listItem()
  .title('Drops')
  .schemaType('drop')
  .icon(CalendarIcon)
  .child(
    S.documentTypeList('drop')
      .child(async (id) =>
        S.document()
        .schemaType('drop')
        .documentId(id)
        .views([S.view.form(), previewPane(S)])
        )
  )
)
