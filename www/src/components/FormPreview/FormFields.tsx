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
  const { control } = useFormMethods;

  return (
    <Grid container spacing={3} style={{ marginBottom: 0 }}>
      {fields.map((field, i) => {
        if (!field) return null;

        return (
          <FieldWrapper
            key={field.name ?? i}
            index={i}
            control={control}
            useFormMethods={useFormMethods}
            {...field}
            {...props}
            setOmittedFields={() => {}}
          />
        );
      })}

      <AddRow index={fields.length} />
    </Grid>
  );
}
