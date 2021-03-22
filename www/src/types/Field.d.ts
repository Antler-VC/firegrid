import { FieldType } from '@antlerengineering/form-builder'

export interface Field extends FieldType {
  section?: string

  conditional?: 'check' | 'option'
  displayCondition?: string

  assistiveText?: string

  required?: boolean
  disabled?: boolean

  validation: string[]
}
