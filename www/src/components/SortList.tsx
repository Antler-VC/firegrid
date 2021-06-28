import { IFieldComponentProps } from '@antlerengineering/form-builder';
import { useWatch } from 'react-hook-form';
import _shuffle from 'lodash/shuffle';

import { Grid, Button } from '@material-ui/core';
import SortByAlphaIcon from '@material-ui/icons/SortByAlpha';
import ShuffleIcon from '@material-ui/icons/Shuffle';

export default function SortList({
  useFormMethods: { control, setValue },
}: IFieldComponentProps) {
  const values = useWatch({ control, name: 'values' });

  const sortable = Array.isArray(values) && values.length > 0;

  const sortAlpha = () => {
    if (sortable) {
      // https://stackoverflow.com/questions/8996963/how-to-perform-case-insensitive-sorting-in-javascript
      const sorted = [...values].sort((a, b) =>
        a.localeCompare(b, undefined, { sensitivity: 'base' })
      );
      setValue('values', sorted);
    }
  };

  const shuffleList = () => {
    if (sortable) setValue('values', _shuffle(values));
  };

  return (
    <Grid container spacing={2} style={{ paddingLeft: 44 }}>
      <Grid item>
        <Button
          color="secondary"
          disabled={!sortable}
          startIcon={<SortByAlphaIcon />}
          onClick={sortAlpha}
        >
          Sort Alphabetically
        </Button>
      </Grid>
      <Grid item>
        <Button
          color="secondary"
          disabled={!sortable}
          startIcon={<ShuffleIcon />}
          onClick={shuffleList}
        >
          Shuffle
        </Button>
      </Grid>
    </Grid>
  );
}
