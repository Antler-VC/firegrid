import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import _find from 'lodash/find';

import {
  makeStyles,
  createStyles,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
} from '@material-ui/core';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

import useRouter from '../../hooks/useRouter';

const useStyles = makeStyles((theme) =>
  createStyles({
    listItem: {
      color: theme.palette.text.secondary,
      minHeight: 48,
      transition: theme.transitions.create(['background-color', 'color']),
      '& $listItemIcon': { transition: theme.transitions.create('color') },
    },
    listItemSelected: {
      color: theme.palette.text.primary,
      '& $listItemIcon': { color: theme.palette.text.primary },
    },
    listItemIcon: {},
    listItemText: {
      ...theme.typography.button,
      display: 'block',
      color: 'inherit',
    },

    dropdownIcon: {
      color: theme.palette.action.active,
      transition: theme.transitions.create('transform'),
    },
    dropdownIconOpen: { transform: 'rotate(180deg)' },

    childListItem: {
      minHeight: 40,
      paddingLeft: theme.spacing(11),
    },
    childListItemText: {
      ...theme.typography.overline,
      display: 'block',
      color: 'inherit',
    },
  })
);

export interface INavSidebarItemProps {
  item: any;
}

export default function NavSidebarItem({ item }: INavSidebarItemProps) {
  const classes = useStyles();
  const router = useRouter();

  const [openChildren, setOpenChildren] = useState(
    '/' + router.location.pathname.toLowerCase().split('/')[1] ===
      item.route.toLowerCase()
  );

  useEffect(() => {
    if (!Array.isArray(item.children) || item.children.length === 0) return;
    const childItem = _find(
      item.children,
      (item) =>
        item.route.toLowerCase() === router.location.pathname.toLowerCase()
    );
    if (!!childItem)
      document.title = `${childItem.label} | ${item.label} | Hub Kit`;
  }, [router.location.pathname, item]);

  if (!Array.isArray(item.children) || item.children.length === 0)
    return (
      <li>
        <ListItem
          button
          selected={
            router.location.pathname.toLowerCase() === item.route.toLowerCase()
          }
          component={item.externalRoute ? 'a' : Link}
          to={!item.externalRoute ? item.route : undefined}
          href={item.externalRoute && item.route}
          target={item.externalRoute ? '_blank' : undefined}
          classes={{
            root: classes.listItem,
            selected: classes.listItemSelected,
          }}
        >
          <ListItemIcon className={classes.listItemIcon}>
            <item.Icon />
          </ListItemIcon>

          <ListItemText
            primary={item.label}
            classes={{ primary: classes.listItemText }}
          />

          {item.children && <ArrowDropDownIcon />}
        </ListItem>
      </li>
    );

  return (
    <li>
      <ListItem
        button
        selected={
          router.location.pathname.toLowerCase() === item.route.toLowerCase()
        }
        classes={{
          root: classes.listItem,
          selected: classes.listItemSelected,
        }}
        onClick={() => setOpenChildren((state) => !state)}
      >
        <ListItemIcon className={classes.listItemIcon}>
          <item.Icon />
        </ListItemIcon>

        <ListItemText
          primary={item.label}
          classes={{ primary: classes.listItemText }}
        />

        <ArrowDropDownIcon
          className={clsx(
            classes.dropdownIcon,
            openChildren && classes.dropdownIconOpen
          )}
        />
      </ListItem>

      <Collapse in={openChildren}>
        <List>
          {item.children.map((childItem) => (
            <li key={childItem.route}>
              <ListItem
                button
                selected={router.location.pathname
                  .toLowerCase()
                  .startsWith(childItem.route.toLowerCase())}
                component={item.externalRoute ? 'a' : Link}
                to={!childItem.externalRoute ? childItem.route : undefined}
                href={childItem.externalRoute && childItem.route}
                classes={{
                  root: clsx(classes.listItem, classes.childListItem),
                  selected: classes.listItemSelected,
                }}
              >
                <ListItemText
                  primary={childItem.label}
                  classes={{ primary: classes.childListItemText }}
                />
              </ListItem>
            </li>
          ))}
        </List>
      </Collapse>
    </li>
  );
}
