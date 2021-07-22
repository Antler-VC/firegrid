import { useFormContext } from 'react-hook-form';
import _includes from 'lodash/includes';
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

  const duplicateFieldKeys = selectedForm!.fields
    .map((x) => x.name)
    .filter((val, i, arr) => _includes(arr, val, i + 1));

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
            hasDuplicateKey={duplicateFieldKeys.includes(field.name)}
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
