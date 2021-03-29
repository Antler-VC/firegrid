import { useState } from 'react';
import _uniq from 'lodash/uniq';
import { useFiregridContext } from 'contexts/FiregridContext';

import { Grid } from '@material-ui/core';
import MultiSelect from '@antlerengineering/multiselect';

export default function FormSelectors() {
  const { forms, selectedForm, setSelectedFormId } = useFiregridContext();

  const [selectedApp, setSelectedApp] = useState(selectedForm?.app ?? '');

  return (
    <Grid
      container
      spacing={3}
      direction="column"
      wrap="nowrap"
      style={{ marginBottom: 24 }}
    >
      <Grid item>
        <MultiSelect
          label="App"
          labelPlural="app"
          options={_uniq(forms.map((doc) => doc.app))}
          multiple={false}
          value={selectedApp}
          onChange={setSelectedApp as any}
          TextFieldProps={{ autoFocus: true }}
        />
      </Grid>
      <Grid item>
        <MultiSelect
          label="Form"
          labelPlural="forms"
          options={forms
            .filter((doc) => doc.app === selectedApp)
            .map((doc) => ({ value: doc.id, label: doc.name }))}
          multiple={false}
          value={selectedForm?.id ?? ''}
          onChange={setSelectedFormId as any}
          disabled={!selectedApp}
        />
      </Grid>
    </Grid>
  );
}
