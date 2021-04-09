import { useFormContext, useWatch } from 'react-hook-form';

import { Grid } from '@material-ui/core';

import { Fields, CustomComponents } from '@antlerengineering/form-builder';
import FieldWrapper, { IFieldWrapperProps } from './FieldWrapper';
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
        // Call the field displayCondition function with values if necessary
        if (
          !!field.displayCondition &&
          typeof field.displayCondition === 'string'
        )
          return (
            <DependentField
              key={i}
              index={i}
              control={control}
              errors={errors}
              useFormMethods={useFormMethods}
              {...field}
              {...props}
            />
          );

        // Otherwise, just use the field object
        // If we intentionally hide this field due to form values, don’t render
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

/**
 * Wrap the field declaration around this component so we can access
 * `useWatch` and it updates whenever the form’s values update
 */
function DependentField({ displayCondition, ...props }: IFieldWrapperProps) {
  const values = useWatch({ control: props.control });

  try {
    // eslint-disable-next-line no-new-func
    const displayConditionFunction = new Function(
      'values',
      '"use strict";\n' + displayCondition!
    );
    const displayConditionResult = displayConditionFunction(values);

    // If we intentionally hide this field due to form values, don’t render
    // if (!displayConditionResult) return null;

    return <FieldWrapper {...props} />;
  } catch (e) {
    console.error('Failed to evaluate displayCondition function');
    console.error(e);
    return null;
  }
}
