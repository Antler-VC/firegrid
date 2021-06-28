import { useState, useEffect } from 'react';
import { useWatch } from 'react-hook-form';
import _camelCase from 'lodash/camelCase';
import { useDebouncedCallback } from 'use-debounce';
import { IFieldComponentProps } from '@antlerengineering/form-builder';

import { TextField, FormHelperText } from '@material-ui/core';

import { db } from '../../firebase';
import { DB_ROOT_FORMS } from 'constants/firegrid';

export default function ListKey({
  field: { onChange, value: formValue, onBlur, ref },
  name,
  label,
  required,
  errorMessage,
  assistiveText,
  useFormMethods,
}: IFieldComponentProps) {
  const [listName] = useWatch({
    control: useFormMethods.control,
    name: ['name'],
  }) as any;

  const [value, setValue] = useState(formValue);

  useEffect(() => {
    if (listName) setValue(_camelCase(listName));
    else if (value !== '') setValue('');
  }, [listName]);

  const [loading, setLoading] = useState(false);

  const validate = useDebouncedCallback(async (value: string) => {
    if (!value) return;

    setLoading(true);
    const docExists = (await db.collection(DB_ROOT_FORMS).doc(value).get())
      .exists;
    setLoading(false);

    if (docExists) {
      onChange('');
      useFormMethods.setError(name, {
        type: 'manual',
        message: 'This list key is used by another list',
        shouldFocus: true,
      });
    } else {
      onChange(value);
      useFormMethods.clearErrors(name);
    }
  }, 1000);

  useEffect(() => {
    onChange('');
    validate(value);
  }, [value]);

  return (
    <TextField
      name={name}
      onChange={(e) => setValue(e.target.value)}
      value={value}
      onBlur={onBlur}
      label={label}
      required={required}
      inputRef={ref}
      fullWidth
      error={!!errorMessage}
      FormHelperTextProps={{ component: 'div' } as any}
      helperText={
        (errorMessage || assistiveText) && (
          <>
            {loading ? 'Validating list key…' : errorMessage}

            <FormHelperText
              style={{ margin: 0, whiteSpace: 'pre-line' }}
              error={false}
            >
              {assistiveText}
            </FormHelperText>
          </>
        )
      }
    />
  );
}
