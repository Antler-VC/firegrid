import { Link } from 'react-router-dom'
import clsx from 'clsx'

import {
  makeStyles,
  createStyles,
  Drawer,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  Button,
  ListItemAvatar,
  ListItemText,
  Avatar,
} from '@material-ui/core'

import Logo from '@antlerengineering/components/src/assets/antler-logo.svg'
import NavSidebarItem from './NavSidebarItem'
import { SIDEBAR_WIDTH } from '@antlerengineering/components'
import { routes } from 'constants/routes'
import { useAppContext } from 'contexts/AppContext'

const useStyles = makeStyles((theme) =>
  createStyles({
    root: {
      width: SIDEBAR_WIDTH,
      overflowX: 'hidden',
    },
    paper: {
      boxSizing: 'content-box',
      paddingLeft: 'env(safe-area-inset-left)',
    },
    paperAnchorDockedLeft: { borderRight: 0 },

    grid: { height: `calc(100% + ${theme.spacing(1.5)}px)` },

    logoListItem: {
      ...theme.mixins.toolbar,

      backgroundColor: theme.palette.background.paper,
      position: 'sticky',
      top: 0,
      zIndex: 1,
    },

    navList: {
      paddingTop: theme.spacing(2),
    },

    profilePhoto: {
      width: 24,
      height: 24,
    },

    signOut: {
      margin: theme.spacing(-2, 0, 0, -1),
    },
  })
)

export interface INavSidebarProps {
  sidebarCollapsed: boolean
  open: boolean
  onCloseDrawer: () => void
}

export default function NavSidebar({
  sidebarCollapsed,
  open,
  onCloseDrawer,
}: INavSidebarProps) {
  const classes = useStyles()

  const { currentUser, navItems } = useAppContext()

  return (
    <Drawer
      variant={sidebarCollapsed ? 'temporary' : 'persistent'}
      open={!sidebarCollapsed || open}
      onClose={onCloseDrawer}
      classes={{
        root: classes.root,
        paper: clsx(classes.root, classes.paper),
        paperAnchorDockedLeft: classes.paperAnchorDockedLeft,
      }}
      ModalProps={{ keepMounted: true }}
      PaperProps={{ elevation: 8 }}
    >
      <Grid
        container
        justify="space-between"
        direction="column"
        className={classes.grid}
        wrap="nowrap"
        spacing={3}
      >
        <Grid item xs component="nav" aria-label="main navigation">
          <ListItem
            button
            component={Link}
            to="/"
            classes={{ root: classes.logoListItem }}
          >
            <ListItemIcon>
              <></>
            </ListItemIcon>
            <img src={Logo} alt="Logo" width="auto" height="32" />
          </ListItem>

          <List className={classes.navList}>
            {navItems.map((item) => (
              <NavSidebarItem key={item.route} item={item} />
            ))}
          </List>
        </Grid>

        {/* Spacer */}
        <Grid item xs />

        <Grid item>
          <ListItem>
            <ListItemAvatar>
              {currentUser?.photoURL ? (
                <Avatar
                  src={currentUser?.photoURL}
                  className={classes.profilePhoto}
                />
              ) : (
                <span />
              )}
            </ListItemAvatar>

            <ListItemText
              primary={currentUser?.displayName}
              primaryTypographyProps={{
                variant: 'body1',
              }}
            />
          </ListItem>

          <ListItem>
            <ListItemAvatar>
              <span />
            </ListItemAvatar>

            <Button
              color="primary"
              component={Link}
              to={routes.signOut}
              className={classes.signOut}
            >
              Sign Out
            </Button>
          </ListItem>
        </Grid>
      </Grid>
    </Drawer>
  )
}
