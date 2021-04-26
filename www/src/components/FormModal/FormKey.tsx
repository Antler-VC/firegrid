import { useState, useEffect } from 'react';
import { useWatch } from 'react-hook-form';
import _camelCase from 'lodash/camelCase';
import { useDebouncedCallback } from 'use-debounce';
import { IFieldComponentProps } from '@antlerengineering/form-builder';

import { TextField, FormHelperText } from '@material-ui/core';

import { db } from '../../firebase';
import { DB_ROOT } from 'constants/firegrid';

export default function FormKey({
  field: { onChange, value: formValue, onBlur, ref },
  name,
  label,
  required,
  errorMessage,
  assistiveText,
  useFormMethods,
}: IFieldComponentProps) {
  const [app, formName] = useWatch({
    control: useFormMethods.control,
    name: ['app', 'name'],
  }) as any;

  const [value, setValue] = useState(formValue);

  useEffect(() => {
    if (app && formName) setValue(`${_camelCase(app)}-${_camelCase(formName)}`);
    else if (value !== '') setValue('');
  }, [app, formName]);

  const [loading, setLoading] = useState(false);

  const validate = useDebouncedCallback(async (value: string) => {
    if (!value) return;

    setLoading(true);
    const docExists = (await db.collection(DB_ROOT).doc(value).get()).exists;
    setLoading(false);

    if (docExists) {
      onChange('');
      useFormMethods.setError(name, {
        type: 'manual',
        message: 'This form key is used by another form',
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
            {loading ? 'Validating form key…' : errorMessage}

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
