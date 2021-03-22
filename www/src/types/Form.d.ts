import { Field } from './Field'

export interface Form {
  id: string
  app: string
  name: string
  fields: Field[]
}
