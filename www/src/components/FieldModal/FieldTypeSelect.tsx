import React, { useEffect } from 'react';
import _startCase from 'lodash/startCase';

import { useTheme } from '@material-ui/core';
import CodeIcon from '@material-ui/icons/Code';

import MultiSelect from '@antlerengineering/multiselect';
import {
  IFieldComponentProps,
  FieldConfigs,
  getFieldProp,
} from '@antlerengineering/form-builder';

export interface IFieldTypeSelectProps extends IFieldComponentProps {
  newFieldType: string;
  setNewFieldType: React.Dispatch<React.SetStateAction<string>>;
}

export default function FieldTypeSelect({
  field: { onChange, onBlur, value, ref },
  fieldState,
  formState,

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
      AutocompleteProps={{ groupBy: (option) => option.group || 'Custom' }}
      itemRenderer={(option: any) => (
        <>
          <span
            style={{
              marginRight: theme.spacing(2),
              display: 'flex',
              color: theme.palette.action.active,
            }}
          >
            {option.icon || <CodeIcon />}
          </span>
          {option.label}
        </>
      )}
      TextFieldProps={{
        onBlur,
        InputLabelProps: { required: true },
        SelectProps: {
          renderValue: () => {
            if (!value) return null;

            if (getFieldProp('name', value))
              return (
                <>
                  {_startCase(getFieldProp('group', value))}
                  &nbsp;–&nbsp;
                  {getFieldProp('name', value)}
                </>
              );

            return <>Custom&nbsp;–&nbsp;{value}</>;
          },
        },
        inputRef: ref,
      }}
      freeText
      AddButtonProps={{
        children: 'Use Custom Field Type',
        startIcon: <CodeIcon />,
      }}
      AddDialogProps={{
        title: 'Use Custom Field Type',
        textFieldLabel: 'Custom Field Type Key',
        addButtonLabel: 'Done',
      }}
    />
  );
}
