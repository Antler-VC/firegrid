import React, { useState, useRef } from 'react';
import _find from 'lodash/find';

import { useTheme, Button } from '@material-ui/core';
import CodeIcon from '@material-ui/icons/Code';
import CopyIcon from '@material-ui/icons/FileCopyOutlined';

import MultiSelect from '@antlerengineering/multiselect';
import {
  IFieldComponentProps,
  FieldConfigs,
} from '@antlerengineering/form-builder';
import { CustomFieldConfigs } from 'components/CustomFields';
import { useFiregridContext } from 'contexts/FiregridContext';

export interface ICopyFieldConfigSelectProps extends IFieldComponentProps {
  newFieldType: string;
  setNewFieldType: React.Dispatch<React.SetStateAction<string>>;
}

export default function CopyFieldConfigSelect({
  field: { onChange, onBlur, value, ref },
  fieldState,
  formState,

  name,
  label,

  newFieldType,
  setNewFieldType,
  useFormMethods,
  ...props
}: ICopyFieldConfigSelectProps) {
  const theme = useTheme();
  const { selectedForm } = useFiregridContext();

  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleChange = (fieldName: string) => {
    onChange(fieldName);

    const match = _find(selectedForm?.fields, ['name', fieldName]);
    if (!match) return;
    setNewFieldType(match.type);

    Object.entries(match).forEach(([key, value]) => {
      if (key === 'name') return;
      useFormMethods.setValue(key, value);
    });
  };

  const options =
    selectedForm?.fields
      .map((config, index) => ({
        value: config.name!,
        label: `${index + 1}. ${config.label || config.name!}`,
        icon: _find(
          [...FieldConfigs, ...CustomFieldConfigs],
          ['type', config.type]
        )?.icon,
      }))
      .filter((x) => !!x.value) ?? [];

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<CopyIcon />}
        onClick={() => setOpen(true)}
        ref={buttonRef}
      >
        {label}
      </Button>

      <MultiSelect
        {...props}
        label="Field to Copy"
        labelPlural="fields"
        multiple={false}
        value={value}
        onChange={handleChange as any}
        onClose={() => setOpen(false)}
        options={options}
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
            <span
              style={{
                maxWidth: 300 - 13,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {option.label}
            </span>
          </>
        )}
        TextFieldProps={{
          style: { display: 'none' },
          SelectProps: {
            open,
            MenuProps: {
              anchorEl: buttonRef.current,
              anchorOrigin: { vertical: 'bottom', horizontal: 'left' },
              transformOrigin: { vertical: 'top', horizontal: 'left' },
            },
          },
        }}
      />
    </>
  );
}
