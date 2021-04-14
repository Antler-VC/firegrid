import React, { useState } from 'react';

import {
  useTheme,
  Button,
  FormHelperText,
  DialogContentText,
} from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import CodeIcon from '@material-ui/icons/Code';

import { Modal } from '@antlerengineering/components';
import CodeEditor from 'components/CodeEditor';

import {
  IFieldComponentProps,
  Field,
  getFieldProp,
} from '@antlerengineering/form-builder';

const getFunctionCannotBeEvaluated = (body: string) => {
  try {
    // eslint-disable-next-line no-new-func
    new Function('values', '"use strict";\n' + body);

    return false;
  } catch (e) {
    return e.message;
  }
};

export interface IDisplayConditionEditorProps extends IFieldComponentProps {
  fields: Field[];
}

export const DisplayConditionEditor = React.forwardRef(
  function DisplayConditionEditor(
    { onChange, value: formValue, fields }: IDisplayConditionEditorProps,
    ref
  ) {
    const theme = useTheme();

    const hasSavedValue =
      typeof formValue === 'string' && formValue.trim().length > 0;

    const [value, setValue] = useState(formValue);

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => {
      setOpen(false);
      setValue(formValue);
    };

    const functionCannotBeEvaluated = getFunctionCannotBeEvaluated(value);

    const [errors, setErrors] = useState<any[]>([]);
    const noReturnStatement =
      typeof value === 'string' && value.indexOf('return ') === -1;
    const disableSave =
      noReturnStatement || errors.length > 0 || functionCannotBeEvaluated;

    // force save
    const [showForceSave, setShowForceSave] = useState(false);
    const handleKeyChange = (key) =>
      setShowForceSave(key.shiftKey && key.ctrlKey);

    const handleSave = () => {
      onChange(value);
      setOpen(false);
    };

    return (
      <>
        <Button
          variant="outlined"
          startIcon={<CodeIcon />}
          onClick={handleOpen}
          ref={ref as any}
        >
          Display Condition
          {hasSavedValue && ': Active'}
        </Button>

        {hasSavedValue && (
          <FormHelperText>
            This field will be conditionally displayed depending on the values
            the user has entered into the form.
          </FormHelperText>
        )}

        {open && (
          <Modal
            onClose={handleClose}
            title="Edit Display Condition"
            children={
              <>
                <DialogContentText>
                  Conditionally display the field depending on the values the
                  user has entered into the form using code.
                </DialogContentText>

                <DialogContentText>
                  Write the function body of your display condition below. You
                  can use the <code>values</code> variable to access form
                  values. Return <code>true</code> to display this field and{' '}
                  <code>false</code> to hide it.
                </DialogContentText>

                <CodeEditor
                  value={value}
                  onChange={setValue}
                  extraLibs={[
                    ` declare class values {
                        ${fields
                          .map(({ name, type, conditional }) => {
                            if (getFieldProp('group', type) === 'content')
                              return '';

                            return `static readonly ${name}: ${
                              getFieldProp('dataType', type) || 'any'
                            }${conditional ? ' | undefined' : ''}`;
                          })
                          .join('\n')}
                      }`,
                  ]}
                  onValidate={setErrors}
                  height={200}
                  wrapperProps={{
                    style: { border: `1px solid ${theme.palette.divider}` },
                  }}
                />

                {errors.length > 0 && (
                  <Alert severity="error">
                    <AlertTitle color="inherit">
                      Please resolve the following errors detected in your code:
                    </AlertTitle>
                    {errors.map(
                      ({ startLineNumber, startColumn, message }, index) => (
                        <li key={index}>
                          Line {startLineNumber}, Col {startColumn}: {message}
                        </li>
                      )
                    )}
                  </Alert>
                )}

                {noReturnStatement && (
                  <Alert severity="error">Please return a boolean.</Alert>
                )}

                {functionCannotBeEvaluated && (
                  <Alert severity="error">
                    <AlertTitle color="inherit">
                      Your code cannot be executed:
                    </AlertTitle>
                    {functionCannotBeEvaluated}
                  </Alert>
                )}
              </>
            }
            actions={{
              primary: {
                children: showForceSave ? 'Force Save' : 'Save Changes',
                onClick: handleSave,
                disabled: disableSave && !showForceSave,
              },
              secondary: {
                children: 'Cancel',
                onClick: handleClose,
              },
            }}
            onKeyDown={handleKeyChange}
            onKeyUp={handleKeyChange}
          />
        )}
      </>
    );
  }
);

export default DisplayConditionEditor;
