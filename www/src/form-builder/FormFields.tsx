import React from 'react';
import _isFunction from 'lodash/isFunction';
import { UseFormMethods, useWatch } from 'react-hook-form';

import { Grid } from '@material-ui/core';

import {
  Fields,
  // Field, Values,
  CustomComponents,
} from './types';

import FieldWrapper from './FieldWrapper';

export interface IFormFieldsProps {
  fields: Fields;

  control: UseFormMethods['control'];
  errors: UseFormMethods['errors'];
  customComponents?: CustomComponents;
  useFormMethods: UseFormMethods;
}

export default function FormFields({ fields, ...props }: IFormFieldsProps) {
  return (
    <Grid container spacing={3} style={{ marginBottom: 0 }}>
      {fields.map((field, i) => {
        // Call the field function with values if necessary
        if (_isFunction(field))
          return (
            <DependentField
              key={i}
              index={i}
              fieldFunction={field}
              {...props}
            />
          );

        // Otherwise, just use the field object
        // If we intentionally hide this field due to form values, don’t render
        if (!field) return null;

        return (
          <FieldWrapper key={field.name ?? i} index={i} {...field} {...props} />
        );
      })}
    </Grid>
  );
}

// interface IDependentField extends Omit<IFieldWrapperProps, 'type'> {
//   fieldFunction: (values: Values) => Field | null;
// }
function DependentField({ fieldFunction, ...props }: any) {
  const values = useWatch({ control: props.control });

  const field = fieldFunction(values);

  // If we intentionally hide this field due to form values, don’t render
  if (!field) return null;

  return <FieldWrapper {...field} {...props} />;
}
