// import {HashIcon} from '@sanity/icons'
import {ListItemBuilder} from 'sanity/desk'

import defineStructure from '../utils/defineStructure'
import {previewPane} from './preview'

export default defineStructure<ListItemBuilder>((S) =>
S.listItem()
  .title('Styles')
  .schemaType('style')
  // .icon(HashIcon)
  .child(
    S.documentTypeList('style')
      .child(async (id) =>
        S.document()
        .schemaType('style')
        .documentId(id)
        .views([S.view.form(), previewPane(S)])
        )
  )
)
