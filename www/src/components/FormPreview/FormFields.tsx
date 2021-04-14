import { useFormContext } from 'react-hook-form';

import { Grid } from '@material-ui/core';

import { Fields, CustomComponents } from '@antlerengineering/form-builder';
import FieldWrapper from './FieldWrapper';
import AddRow from './AddRow';

export interface IFormFieldsProps {
  fields: Fields;

  customComponents?: CustomComponents;
}

export default function FormFields({ fields, ...props }: IFormFieldsProps) {
  const useFormMethods = useFormContext();
  const { control, errors } = useFormMethods;

  return (
    <Grid container spacing={3} style={{ marginBottom: 0 }}>
      {fields.map((field, i) => {
        if (!field) return null;

        return (
          <FieldWrapper
            key={field.name ?? i}
            index={i}
            control={control}
            errors={errors}
            useFormMethods={useFormMethods}
            {...field}
            {...props}
          />
        );
      })}

      <AddRow index={fields.length} />
    </Grid>
  );
}
