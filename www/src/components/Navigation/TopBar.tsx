import { useContext, useEffect } from 'react';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import _find from 'lodash/find';
import _findIndex from 'lodash/findIndex';

import {
  makeStyles,
  createStyles,
  useScrollTrigger,
  AppBar,
  Toolbar,
  Container,
  Grid,
  IconButton,
  Typography,
  Tabs,
  Tab,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

import useRouter from '../../hooks/useRouter';
import { AppContext } from 'contexts/AppContext';

const useStyles = makeStyles((theme) =>
  createStyles({
    appBar: { color: theme.palette.text.secondary },
    appBarScrolled: { boxShadow: `0 -1px 0 0 ${theme.palette.divider} inset` },

    grid: {
      ...theme.mixins.toolbar,

      marginTop: 0,
      marginBottom: 0,
      '& > div': {
        paddingTop: '0 !important',
        paddingBottom: '0 !important',
      },
    },

    title: {
      display: 'block',

      [theme.breakpoints.down('sm')]: theme.typography.h6,
    },
    titleWithTabs: {
      [theme.breakpoints.up('md')]: { marginRight: theme.spacing(3) },
    },

    tabsContainer: {
      alignSelf: 'flex-end',
      [theme.breakpoints.down('sm')]: {
        margin: theme.spacing(0, -3),
        maxWidth: `calc(100% + ${theme.spacing(3) * 2}px)`,
      },
      [theme.breakpoints.down('xs')]: {
        margin: theme.spacing(0, -2),
        maxWidth: `calc(100% + ${theme.spacing(2) * 2}px)`,
      },
    },
    tabsFlexContainer: {
      [theme.breakpoints.down('sm')]: { paddingLeft: theme.spacing(3) },
      [theme.breakpoints.down('xs')]: { paddingLeft: theme.spacing(2) },
    },
    tab: {
      [theme.breakpoints.up('md')]: { minHeight: 64 },
    },
  })
);

function a11yProps(index: any) {
  return {
    id: `sub-navigation-tab-${index}`,
    'aria-controls': `sub-navigation-tabpanel-${index}`,
  };
}

export interface ITopBarProps {
  sidebarCollapsed: boolean;
  onDrawerToggle: () => void;
}

export default function TopBar({
  sidebarCollapsed,
  onDrawerToggle,
}: ITopBarProps) {
  const classes = useStyles();
  const router = useRouter();
  const { navItems } = useContext(AppContext);

  const scrollTrigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0,
  });

  const topLevelPath = '/' + router.location.pathname?.split('/')[1];
  const topLevelItem =
    _find(
      navItems,
      (item) => item.route.toLowerCase() === topLevelPath.toLowerCase()
    ) ??
    _find(
      navItems,
      (item) =>
        item.route.toLowerCase() === router.location.pathname.toLowerCase()
    );

  useEffect(() => {
    if (!topLevelItem?.label || !topLevelItem) document.title = 'Firegrid';
    else if (!document.title.includes(topLevelItem!.label))
      document.title = `${topLevelItem!.label} | Firegrid`;
  }, [topLevelItem]);

  return (
    <AppBar
      position="sticky"
      className={clsx(classes.appBar, scrollTrigger && classes.appBarScrolled)}
      color="default"
      elevation={0}
    >
      <Toolbar disableGutters>
        <Container>
          <Grid
            container
            className={classes.grid}
            alignItems="center"
            spacing={1}
          >
            {sidebarCollapsed && (
              <Grid item>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={onDrawerToggle}
                >
                  <MenuIcon />
                </IconButton>
              </Grid>
            )}

            <Grid item xs>
              <Typography
                variant="h5"
                component="h1"
                noWrap
                className={clsx(
                  classes.title,
                  topLevelItem?.children && classes.titleWithTabs
                )}
                color="textPrimary"
              >
                {topLevelItem?.label}
              </Typography>
            </Grid>

            {topLevelItem?.children && (
              <Grid item xs={12} md="auto" className={classes.tabsContainer}>
                <Tabs
                  value={_findIndex(topLevelItem.children, (child) =>
                    router.location.pathname
                      .toLowerCase()
                      .startsWith(child.route.toLowerCase())
                  )}
                  aria-label="subnavigation"
                  variant="scrollable"
                  scrollButtons="auto"
                  classes={{ flexContainer: classes.tabsFlexContainer }}
                  action={(actions) =>
                    setTimeout(() => actions?.updateIndicator(), 100)
                  }
                >
                  {topLevelItem.children.map((child, i) => (
                    <Tab
                      key={child.route}
                      label={child.label}
                      component={Link}
                      to={child.route}
                      className={classes.tab}
                      {...a11yProps(i)}
                    />
                  ))}
                </Tabs>
              </Grid>
            )}
          </Grid>
        </Container>
      </Toolbar>
    </AppBar>
  );
}
