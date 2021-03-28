import { IFieldConfig } from '../../types'
import { FieldType } from '../../constants/fields'

export const ContentSubHeaderSettings: IFieldConfig['settings'] = [
  {
    name: 'label',
    label: 'Sub-Header',
    type: FieldType.shortText,
    defaultValue: 'Sub-Header',
  },
]

export default ContentSubHeaderSettings
