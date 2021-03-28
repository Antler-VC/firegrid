import { UseFormMethods } from 'react-hook-form'
import { FieldType } from './constants/fields'
import { GridProps } from '@material-ui/core'

export type Values = { [key: string]: any }

export type Field = {
  type: FieldType | string
  name?: string

  label?: string
  assistiveText?: string

  conditional?: 'check' | 'option'
  displayCondition?: string
  required?: boolean
  disabled?: boolean
  validation?: string[]

  defaultValue?: any
  gridCols?: GridProps['xs']

  [key: string]: any
}
export type Fields = Field[]

export interface IFieldComponentProps {
  index: number
  control: UseFormMethods['control']
  name: string
  useFormMethods: UseFormMethods

  label: string
  errorMessage?: string
  assistiveText?: string

  required?: boolean
  disabled?: boolean

  [key: string]: any
}

export type CustomComponent<
  P extends IFieldComponentProps = IFieldComponentProps
> = React.ComponentType<P> | React.LazyExoticComponent<React.ComponentType<P>>

export type CustomComponents<
  P extends IFieldComponentProps = IFieldComponentProps
> = {
  [type: string]: {
    component: CustomComponent<P>
    defaultValue?: any
  }
}

export interface IFieldConfig {
  type: string
  name: string
  group: 'input' | 'content'
  icon: React.ReactNode
  defaultValue: any
  component: CustomComponent
  settings: Fields
}
