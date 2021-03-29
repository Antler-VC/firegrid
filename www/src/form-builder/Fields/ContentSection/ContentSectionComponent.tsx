import React from 'react';
import clsx from 'clsx';
import { IFieldComponentProps } from '../../types';

import {
  makeStyles,
  createStyles,
  Typography,
  TypographyProps,
  Divider,
} from '@material-ui/core';

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      marginTop: theme.spacing(3),
      marginBottom: -theme.spacing(1),
      width: '100%',

      whiteSpace: 'pre-line',
      cursor: 'default',
    },

    firstField: { marginTop: 0 },

    divider: { marginTop: theme.spacing(0.5) },
  })
);

export interface IContentSectionComponentProps
  extends IFieldComponentProps,
    Partial<Omit<TypographyProps, 'title'>> {}

export default function ContentSectionComponent({
  index,
  label,
  children,
  className,

  control,
  disabled,
  errorMessage,
  name,
  useFormMethods,
  ...props
}: IContentSectionComponentProps) {
  const classes = useStyles();

  return (
    <div
      className={clsx(
        classes.root,
        index === 0 && classes.firstField,
        className
      )}
    >
      <Typography
        variant="h6"
        color="textSecondary"
        {...({ component: 'h3' } as any)}
        {...props}
      >
        {children ?? label}
      </Typography>

      <Divider className={classes.divider} />
    </div>
  );
}
