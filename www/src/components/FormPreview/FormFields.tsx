import React from 'react';
import { useFormContext, useWatch, UseFormMethods } from 'react-hook-form';
import _isFunction from 'lodash/isFunction';

import { Grid } from '@material-ui/core';

import {
  Fields,
  Field,
  Values,
  CustomComponents,
  CustomComponent,
} from 'form-builder/types';
import FieldWrapper from './FieldWrapper';

interface ICommonProps {
  register: UseFormMethods['register'];
  control: UseFormMethods['control'];
  errors: UseFormMethods['errors'];
  customComponents?: CustomComponents;
  useFormMethods: UseFormMethods;
}

export interface IFormFieldsProps {
  fields: Fields;
  customComponents?: CustomComponents;
}
export default function FormFields({ fields, ...props }: IFormFieldsProps) {
  const methods = useFormContext();
  const { register, control, errors } = methods;

  return (
    <Grid
      container
      spacing={3}
      direction="column"
      wrap="nowrap"
      style={{ marginBottom: 0 }}
    >
      {fields.map((field, i) => {
        // Call the field function with values if necessary
        if (_isFunction(field))
          return (
            <DependentField
              key={i}
              index={i}
              fieldFunction={field}
              register={register}
              control={control}
              errors={errors}
              useFormMethods={methods}
              {...props}
            />
          );

        // Otherwise, just use the field object
        // If we intentionally hide this field due to form values, don’t render
        if (!field) return null;

        return (
          <FieldComponent
            key={field.name ?? i}
            index={i}
            {...field}
            register={register}
            control={control}
            errors={errors}
            useFormMethods={methods}
            {...props}
          />
        );
      })}
    </Grid>
  );
}

interface IFieldComponentProps extends Field, ICommonProps {
  index: number;
}
function FieldComponent({
  register,
  control,
  errors,
  type,
  customComponents,
  ...fieldProps
}: IFieldComponentProps) {
  let renderedField: React.ReactNode = null;

  switch (type) {
    // case FieldType.heading:
    //   renderedField = <Heading {...fieldProps} />
    //   break

    // case FieldType.description:
    //   renderedField = <Description {...fieldProps} />
    //   break

    case undefined:
      console.error('undefined field type');
      return null;

    default:
      let fieldComponent: CustomComponent;

      // Try to get fieldComponent from customComponents list
      if (
        !!customComponents &&
        Object.keys(customComponents).length > 0 &&
        type in customComponents
      ) {
        fieldComponent = customComponents[type].component;
      }
      // TODO:
      // If not found in customComponents, try to get it from the built-in components
      // else if (type in FIELD_COMPONENTS) {
      //   fieldComponent = FIELD_COMPONENTS[type as FieldType]
      // }
      // If not found in either, don’t display anything
      else {
        // TODO: ENABLE
        // console.error(`No matching field component for \`${type}\``)
        return null;
      }

      if (!fieldProps.name) return null;

      renderedField = React.createElement(fieldComponent, {
        ...fieldProps,
        name: fieldProps.name!,
        label: fieldProps.label!,
        control,
        errorMessage: errors[fieldProps.name!]?.message,
      });
  }

  return (
    <FieldWrapper key={fieldProps.name!} name={fieldProps.name!} type={type}>
      {renderedField}
    </FieldWrapper>
  );
}

interface IDependentField extends ICommonProps {
  fieldFunction: (values: Values) => Field | null;
  index: number;
}
function DependentField({ fieldFunction, ...props }: IDependentField) {
  const values = useWatch({ control: props.control });

  const field = fieldFunction(values);

  // If we intentionally hide this field due to form values, don’t render
  // TODO:
  if (!field) return <>FIELD HIDDEN</>;

  return <FieldComponent {...field} {...props} />;
}
