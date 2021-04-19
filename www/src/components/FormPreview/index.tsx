import { useForm, FormProvider } from 'react-hook-form';

import {
  Fields,
  CustomComponents,
  useFormSettings,
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
  const { defaultValues, resolver } = useFormSettings({
    fields,
    customComponents,
  });

  const methods = useForm({ mode: 'all', defaultValues, resolver });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(console.log)}>{children}</form>
    </FormProvider>
  );
}
