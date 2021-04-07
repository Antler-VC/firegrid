import React, { useEffect } from 'react';
import { Controller } from 'react-hook-form';
import _startCase from 'lodash/startCase';

import { useTheme } from '@material-ui/core';
import MultiSelect from '@antlerengineering/multiselect';

import { IFieldComponentProps, FieldConfigs, getFieldProp } from 'form-builder';

export interface IFieldTypeSelectProps extends IFieldComponentProps {
  newFieldType: string;
  setNewFieldType: React.Dispatch<React.SetStateAction<string>>;
}

export default function FieldTypeSelect({
  control,
  name,
  newFieldType,
  setNewFieldType,
  useFormMethods,
  ...props
}: IFieldTypeSelectProps) {
  const theme = useTheme();

  useEffect(() => {
    if (!newFieldType) return;
    const formValue = useFormMethods.getValues(name);
    if (formValue !== newFieldType) useFormMethods.setValue(name, newFieldType);
  }, [newFieldType]);

  return (
    <Controller
      control={control}
      name={name}
      render={({ onChange, onBlur, value }) => (
        <MultiSelect
          {...props}
          label="Field Type"
          multiple={false}
          value={value}
          onChange={(value) => {
            onChange(value);
            setNewFieldType(value);
          }}
          options={FieldConfigs.map((config) => ({
            value: config.type,
            label: config.name,
            group: config.group,
            icon: config.icon,
          }))}
          AutocompleteProps={{ groupBy: (option) => option.group }}
          itemRenderer={(option: any) => (
            <>
              <span
                style={{
                  marginRight: theme.spacing(2),
                  display: 'flex',
                  color: theme.palette.action.active,
                }}
              >
                {option.icon}
              </span>
              {option.label}
            </>
          )}
          TextFieldProps={{
            onBlur,
            InputLabelProps: { required: true },
            SelectProps: {
              renderValue: () =>
                value ? (
                  <>
                    {_startCase(getFieldProp('group', value))}
                    &nbsp;–&nbsp;
                    {getFieldProp('name', value)}
                  </>
                ) : null,
            },
          }}
        />
      )}
    />
  );
}
