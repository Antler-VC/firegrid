import React from 'react'
import { Controller } from 'react-hook-form'
import { IFieldComponentProps } from '../../types'

import { MuiPickersUtilsProvider } from '@material-ui/pickers'
import DateFnsUtils from '@date-io/date-fns'

import { FormHelperText } from '@material-ui/core'
import {
  KeyboardDatePicker,
  KeyboardDatePickerProps,
} from '@material-ui/pickers'

export interface IDateComponentProps
  extends IFieldComponentProps,
    Omit<KeyboardDatePickerProps, 'label' | 'name' | 'onChange' | 'value'> {}

export default function DateComponent({
  control,
  name,
  useFormMethods,

  errorMessage,
  assistiveText,
  ...props
}: IDateComponentProps) {
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Controller
        name={name}
        control={control}
        render={({ onChange, onBlur, value }) => {
          let transformedValue = null
          if (value && 'toDate' in value) transformedValue = value.toDate()
          else if (value !== undefined) transformedValue = value

          return (
            <KeyboardDatePicker
              variant="inline"
              fullWidth
              format="yyyy/MM/dd"
              placeholder="yyyy/MM/dd"
              InputLabelProps={{ shrink: transformedValue !== null }}
              {...props}
              value={transformedValue}
              onChange={onChange}
              onBlur={onBlur}
              error={!!errorMessage}
              FormHelperTextProps={{ component: 'div' } as any}
              helperText={
                (errorMessage || assistiveText) && (
                  <>
                    {errorMessage}

                    <FormHelperText
                      style={{ margin: 0, whiteSpace: 'pre-line' }}
                      error={false}
                    >
                      {assistiveText}
                    </FormHelperText>
                  </>
                )
              }
              data-type="date"
              data-label={props.label ?? ''}
            />
          )
        }}
      />
    </MuiPickersUtilsProvider>
  )
}
