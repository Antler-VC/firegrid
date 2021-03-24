import React from 'react'
import { Controller } from 'react-hook-form'
import { IFieldComponentProps } from '../utils'

import {
  FormControlLabel,
  Checkbox as MuiCheckbox,
  CheckboxProps,
} from '@material-ui/core'
import ErrorMessage from '../ErrorMessage'

export interface ICheckboxProps
  extends IFieldComponentProps,
    Omit<CheckboxProps, 'name'> {}

export default function Checkbox({
  control,
  register,
  name,
  errorMessage,
  label,
  useFormMethods,
  ...props
}: ICheckboxProps) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ onChange, onBlur, value }) => (
        <>
          <FormControlLabel
            control={
              <MuiCheckbox
                {...props}
                checked={value}
                onChange={(e) => onChange(e.target.checked)}
                inputProps={
                  {
                    'data-type': 'checkbox',
                    'data-label': label ?? '',
                  } as any
                }
              />
            }
            onBlur={onBlur}
            label={label}
            style={{ width: '100%' }}
          />
          <ErrorMessage>{errorMessage}</ErrorMessage>
        </>
      )}
    />
  )
}
