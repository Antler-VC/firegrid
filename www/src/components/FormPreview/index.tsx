import { useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import _omitBy from 'lodash/omitBy';
import _isUndefined from 'lodash/isUndefined';

import {
  getDefaultValues,
  getValidationSchema,
  Fields,
  CustomComponents,
} from '@antlerengineering/form-builder';

export interface IFormPreviewProps {
  fields: Fields;
  customComponents?: CustomComponents;
  children: React.ReactNode;
}

export default function FormPreview({
  fields,
  customComponents,
  children,
}: IFormPreviewProps) {
  // TODO: Remove undefined check
  const defaultValues = _omitBy(
    getDefaultValues(fields, customComponents),
    _isUndefined
  );

  const methods = useForm({
    mode: 'all',
    defaultValues,
    resolver: yupResolver(getValidationSchema(fields, customComponents)),
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(console.log)}>{children}</form>
    </FormProvider>
  );
}
