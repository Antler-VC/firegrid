import React, { useState, useEffect, Suspense } from 'react'
import Div100vh from 'react-div-100vh'
import clsx from 'clsx'

import {
  makeStyles,
  createStyles,
  useTheme,
  useMediaQuery,
  Grid,
  Container,
} from '@material-ui/core'

import { Loading, ErrorBoundary } from '@antlerengineering/components'
import TopBar from './TopBar'
import NavSidebar from './NavSidebar'

import useRouter from '../../hooks/useRouter'

const useStyles = makeStyles((theme) =>
  createStyles({
    '@global': {
      body: { overflowX: 'hidden' },
    },

    root: {},

    fullHeight: { height: '100%' },
    mainContainer: {
      '--section-margin': theme.spacing(6) + 'px',
      [theme.breakpoints.down('sm')]: {
        '--section-margin': theme.spacing(4) + 'px',
      },

      paddingTop: 'var(--section-margin)',
      paddingBottom: 'calc(var(--section-margin) + 56px)',
    },
  })
)

export default function Navigation({ children }: React.PropsWithChildren<{}>) {
  const classes = useStyles()
  const theme = useTheme()
  const sidebarCollapsed = useMediaQuery(theme.breakpoints.down('lg'))

  const router = useRouter()

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const handleDrawerToggle = () => setSidebarOpen(!sidebarOpen)
  useEffect(() => {
    setSidebarOpen(false)
  }, [router.location.pathname])

  return (
    <Div100vh
      className={classes.root}
      style={{ minHeight: '100rvh', display: 'flex' }}
    >
      <NavSidebar
        sidebarCollapsed={sidebarCollapsed}
        open={sidebarOpen}
        onCloseDrawer={handleDrawerToggle}
      />

      <Grid item xs>
        <Grid
          container
          wrap="nowrap"
          direction="column"
          className={classes.fullHeight}
        >
          <TopBar
            sidebarCollapsed={sidebarCollapsed}
            onDrawerToggle={handleDrawerToggle}
          />

          <ErrorBoundary>
            <Container
              component="main"
              className={clsx(classes.fullHeight, classes.mainContainer)}
            >
              <Suspense fallback={<Loading />}>{children}</Suspense>
            </Container>
          </ErrorBoundary>
        </Grid>
      </Grid>
    </Div100vh>
  )
}
