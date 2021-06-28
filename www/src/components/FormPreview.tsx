import { useForm, FormProvider } from 'react-hook-form';

import {
  Fields,
  CustomComponents,
  useFormSettings,
  FormFields,
} from '@antlerengineering/form-builder';

export interface IFormPreviewProps {
  fields: Fields;
  customComponents?: CustomComponents;
  children: (formFields: React.ReactNode) => React.ReactNode;
}

export default function FormPreview({
  fields,
  customComponents,
  children,
}: IFormPreviewProps) {
  const { defaultValues, resolver, setOmittedFields } = useFormSettings({
    fields,
    customComponents,
  });

  const methods = useForm({ mode: 'all', defaultValues, resolver });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(console.log)}>
        {children(
          <FormFields
            fields={fields}
            control={methods.control}
            customComponents={customComponents}
            useFormMethods={methods}
            setOmittedFields={setOmittedFields}
          />
        )}
      </form>
    </FormProvider>
  );
}
