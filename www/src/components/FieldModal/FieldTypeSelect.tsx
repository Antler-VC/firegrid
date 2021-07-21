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
  FieldAssistiveText,
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

  errorMessage,
  assistiveText,

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
        error: !!errorMessage,
        InputLabelProps: { required: props.required },
        FormHelperTextProps: { component: 'div' } as any,
        helperText: (errorMessage || assistiveText) && (
          <>
            {errorMessage}

            <FieldAssistiveText
              style={{ margin: 0 }}
              disabled={!!props.disabled}
            >
              {assistiveText}
            </FieldAssistiveText>
          </>
        ),
        SelectProps: {
          renderValue: () => {
            if (!value) return null;

            const match = _find(options, { value });

            if (match)
              return (
                <>
                  {match.icon &&
                    React.cloneElement(match.icon as React.ReactElement, {
                      style: {
                        verticalAlign: 'bottom',
                        margin: theme.spacing(-0.25),
                        marginTop: theme.spacing(-3 / 8),
                        marginRight: theme.spacing(1),
                      },
                    })}
                  {_startCase(match.group)}
                  &nbsp;–&nbsp;
                  {match.label}
                </>
              );

            return <>Custom&nbsp;–&nbsp;{value}</>;
          },
        },
        onBlur,
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
