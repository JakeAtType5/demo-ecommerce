import {DocumentVideoIcon} from '@sanity/icons'
import {ListItemBuilder} from 'sanity/desk'

import defineStructure from '../utils/defineStructure'
import {previewPane} from './preview'

export default defineStructure<ListItemBuilder>((S) =>
S.listItem()
  .title('Episodes')
  .schemaType('episode')
  .icon(DocumentVideoIcon)
  .child(
    S.documentTypeList('episode')
      .child(async (id) =>
        S.document()
        .schemaType('episode')
        .documentId(id)
        .views([S.view.form(), previewPane(S)])
        )
  )
)
