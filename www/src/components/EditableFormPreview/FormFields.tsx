import { useFormContext } from 'react-hook-form';
import { useFiregridContext } from 'contexts/FiregridContext';

import { Grid } from '@material-ui/core';

import { Fields, CustomComponents } from '@antlerengineering/form-builder';
import ModalTitle from './ModalTitle';
import FieldWrapper from './FieldWrapper';
import AddRow from './AddRow';
import ModalFooter from './ModalFooter';

export interface IFormFieldsProps {
  fields: Fields;

  customComponents?: CustomComponents;
}

export default function FormFields({ fields, ...props }: IFormFieldsProps) {
  const { selectedForm } = useFiregridContext();

  const useFormMethods = useFormContext();
  const { control } = useFormMethods;

  return (
    <Grid container spacing={3} style={{ marginBottom: 0 }}>
      {selectedForm!.variant === 'modal' && (
        <Grid item xs={12}>
          <ModalTitle />
        </Grid>
      )}

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

      {selectedForm!.variant === 'modal' && (
        <Grid item xs={12}>
          <ModalFooter />
        </Grid>
      )}
    </Grid>
  );
}
