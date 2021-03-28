import { useForm, FormProvider } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'

import { getDefaultValues, getValidationSchema } from 'form-builder'
import { Fields, CustomComponents } from 'form-builder/types'

export interface IFormPreviewProps {
  fields: Fields
  customComponents?: CustomComponents
  children: React.ReactNode
}

export default function FormPreview({
  fields,
  customComponents,
  children,
}: IFormPreviewProps) {
  const defaultValues = getDefaultValues(fields, customComponents)

  const methods = useForm({
    mode: 'all',
    defaultValues,
    resolver: yupResolver(getValidationSchema(fields)),
  })

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(console.log)}>{children}</form>
    </FormProvider>
  )
}
