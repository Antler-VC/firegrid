import { useState } from 'react';
import { OnValidate } from '@monaco-editor/react';

import { useTheme, FormControl, Typography, Button } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import AlertTitle from '@material-ui/lab/AlertTitle';
import CodeIcon from '@material-ui/icons/Code';

import { FieldLabel } from '@antlerengineering/form-builder';
import CodeEditor from 'components/CodeEditor';

import { IFieldComponentProps, Field } from '@antlerengineering/form-builder';

export interface ICustomSettingsEditorProps extends IFieldComponentProps {
  fields: Field[];
}

export default function CustomSettingsEditor({
  field: { onChange, value, ref },

  name,

  errorMessage,
  useFormMethods,
}: IFieldComponentProps) {
  const theme = useTheme();

  const [showEditor, setShowEditor] = useState(value !== '{}');

  const handleValidate: OnValidate = (errors) => {
    const message = errors
      .map(
        ({ startLineNumber, startColumn, message }) =>
          `\u2022\tLine ${startLineNumber}, Col ${startColumn}: ${message}`
      )
      .join('\n');

    if (message !== '') {
      useFormMethods.setError(name, { type: 'manual', message });
    } else {
      useFormMethods.clearErrors(name);
    }
  };

  if (!showEditor)
    return (
      <div>
        <Button
          variant="outlined"
          startIcon={<CodeIcon />}
          onClick={() => setShowEditor(true)}
        >
          Add Custom Settings
        </Button>
      </div>
    );

  return (
    <FormControl
      error={!!errorMessage}
      disabled={false}
      required={false}
      style={{ display: 'flex' }}
      ref={ref as any}
    >
      <FieldLabel error={!!errorMessage} disabled={false} required={false}>
        Custom Settings
      </FieldLabel>

      <Typography variant="body1" color="textSecondary" paragraph>
        Write any custom settings for this field in JSON format below.
      </Typography>

      <CodeEditor
        value={value}
        onChange={(value) => onChange(value || '')}
        onValidate={handleValidate}
        height={200}
        wrapperProps={{
          style: { border: `1px solid ${theme.palette.divider}` },
        }}
        language="json"
      />

      {errorMessage && (
        <Alert
          severity="error"
          style={{ marginTop: theme.spacing(1), whiteSpace: 'pre-line' }}
        >
          <AlertTitle color="inherit">
            Please resolve the following errors detected in your code:
          </AlertTitle>
          {errorMessage}
        </Alert>
      )}
    </FormControl>
  );
}
