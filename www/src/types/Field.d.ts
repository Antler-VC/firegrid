import { FieldType } from 'form-builder'

export interface Field extends FieldType {
  section?: string
  name?: string

  conditional?: 'check' | 'option'
  displayCondition?: string

  assistiveText?: string

  required?: boolean
  disabled?: boolean

  validation: string[]
}
