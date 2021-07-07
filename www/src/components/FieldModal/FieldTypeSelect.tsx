import React, { useEffect } from 'react';
import _startCase from 'lodash/startCase';
import _find from 'lodash/find';

import { useTheme } from '@material-ui/core';
import CodeIcon from '@material-ui/icons/Code';

import MultiSelect from '@antlerengineering/multiselect';
import {
  IFieldComponentProps,
  FieldConfigs,
  IFieldConfig,
} from '@antlerengineering/form-builder';
import { CustomFieldConfigs } from 'components/CustomFields';

const mapConfigToOption =
  (overrides?: Record<string, any>) => (config: IFieldConfig) => ({
    value: config.type,
    label: config.name,
    group: config.group,
    icon: config.icon,
    ...overrides,
  });

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

  const options = [
    ...FieldConfigs.map(mapConfigToOption()),
    ...CustomFieldConfigs.map(
      mapConfigToOption({
        group: 'Not available on all platforms',
      })
    ),
  ];

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
      options={options}
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

            const match = _find(options, { value });

            if (match)
              return (
                <>
                  {_startCase(match.group)}
                  &nbsp;–&nbsp;
                  {match.label}
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
