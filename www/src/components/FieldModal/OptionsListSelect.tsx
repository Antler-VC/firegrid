import { useState, useEffect } from 'react';
import {
  IFieldComponentProps,
  FieldLabel,
} from '@antlerengineering/form-builder';
import _findIndex from 'lodash/findIndex';

import { FormControl, Typography, Grid, Link, Chip } from '@material-ui/core';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import MultiSelect, { Option } from '@antlerengineering/multiselect';

import { db } from '../../firebase';
import { DB_ROOT_LISTS } from 'constants/firegrid';
import { routes } from 'constants/routes';

export default function OptionsListSelect({
  field: { onChange, value, ref },
  label,
  errorMessage,
}: IFieldComponentProps) {
  const [lists, setLists] = useState<
    Array<Option<string> & { values: string[] }>
  >([]);

  useEffect(() => {
    db.collection(DB_ROOT_LISTS)
      .get()
      .then((res) =>
        setLists(
          res.docs.map((doc) => ({
            value: doc.id,
            label: doc.data().name,
            values: doc.data().values,
          }))
        )
      );
  }, []);

  const index = _findIndex(lists, { value });

  return (
    <FormControl
      error={!!errorMessage}
      disabled={false}
      required={false}
      style={{ display: 'flex' }}
      ref={ref as any}
    >
      <FieldLabel error={!!errorMessage} disabled={false} required={false}>
        Options List
      </FieldLabel>

      <Typography variant="body1" color="textSecondary" paragraph>
        Optionally, use a predefined list of options shared with other forms.
        This list will be appended to the options you have set above.
      </Typography>

      <MultiSelect
        multiple={false}
        value={value}
        onChange={onChange}
        options={lists}
        label={label}
        labelPlural="lists"
        freeText
        AddButtonProps={
          {
            component: 'a',
            href: routes.listEditor,
            target: '_blank',
            rel: 'noopener noreferrer',
            children: 'New List',
            onClick: undefined,
          } as any
        }
      />

      {value && Array.isArray(lists[index]?.values) && (
        <>
          <Grid
            container
            spacing={1}
            alignItems="baseline"
            justify="space-between"
            style={{ marginTop: 0 }}
          >
            <Grid item>
              <Typography variant="overline">
                {lists[index].values.length} Items
              </Typography>
            </Grid>

            <Grid item>
              <Link
                variant="caption"
                href={`${routes.listEditor}/${value}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Edit/sort/shuffle list&nbsp;
                <OpenInNewIcon
                  fontSize="small"
                  style={{ verticalAlign: 'text-bottom' }}
                />
              </Link>
            </Grid>
          </Grid>

          <Grid
            container
            spacing={1}
            wrap="nowrap"
            alignItems="flex-start"
            style={{
              marginTop: 0,
              width: `calc(100% + var(--spacing-modal) + 4px)`,
              overflow: 'hidden',
            }}
          >
            {lists[index].values.slice(0, 5).map((item) => (
              <Grid item>
                <Chip
                  label={item}
                  style={{ whiteSpace: 'nowrap', height: 24 }}
                />
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </FormControl>
  );
}
