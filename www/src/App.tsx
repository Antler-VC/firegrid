import { lazy, Suspense, useEffect } from 'react'
import { Switch, Route } from 'react-router-dom'
import smartlookClient from 'smartlook-client'

import {
  CssBaseline,
  MuiThemeProvider as ThemeProvider,
} from '@material-ui/core'
import Theme from './Theme'

import { AppProvider } from 'contexts/AppContext'
import CustomBrowserRouter from './utils/CustomBrowserRouter'
import SegmentPageTracker from 'utils/SegmentPageTracker'
import PrivateRoute from './utils/PrivateRoute'

import GlobalStyles from './utils/GlobalStyles'
import { routes } from './constants/routes'

import {
  ErrorBoundary,
  Loading,
  EmptyState,
} from '@antlerengineering/components'
import Navigation from './components/Navigation'

import SignOutView from './views/SignOutView'
import ForgotPasswordView from 'views/AuthViews/ForgotPasswordView'
import ResetPasswordView from 'views/AuthViews/ResetPasswordView'
import AuthLinkView from 'views/AuthViews/AuthLinkView'
import GoogleAuthView from 'views/AuthViews/GoogleAuthView'
import SignInView from 'views/AuthViews/SignInView'
import SignUpView from 'views/AuthViews/SignUpView'

const AuthTokenView = lazy(
  () =>
    import(
      /* webpackPrefetch: true */
      /* webpackChunkName: "TokenView" */
      './views/TokenView'
    )
)

export default function App() {
  useEffect(() => {
    smartlookClient.init('smartlook-key')
  }, [])

  return (
    <ThemeProvider theme={Theme}>
      <CssBaseline />
      <GlobalStyles />
      <ErrorBoundary>
        <AppProvider>
          <CustomBrowserRouter>
            <SegmentPageTracker />
            <Suspense fallback={<Loading fullScreen />}>
              <Switch>
                <Route
                  exact
                  path={routes.tokenAuth}
                  render={() => <AuthTokenView />}
                />
                <Route
                  exact
                  path={routes.authLink}
                  render={() => <AuthLinkView />}
                />
                <Route
                  exact
                  path={routes.googleAuth}
                  render={() => <GoogleAuthView />}
                />
                <Route
                  exact
                  path={routes.forgotPassword}
                  render={() => <ForgotPasswordView />}
                />
                <Route
                  exact
                  path={routes.resetPassword}
                  render={() => <ResetPasswordView />}
                />
                <Route
                  exact
                  path={routes.signIn}
                  render={() => <SignInView passwordAuth />}
                />
                <Route
                  exact
                  path={routes.signUp}
                  render={() => <SignUpView passwordAuth />}
                />

                <Route
                  exact
                  path={routes.signOut}
                  render={() => <SignOutView />}
                />

                <PrivateRoute
                  exact
                  path={routes.home}
                  render={() => <Navigation>Home</Navigation>}
                />

                <PrivateRoute
                  exact
                  path={routes.profile}
                  render={() => <Navigation>Profile</Navigation>}
                />

                <PrivateRoute
                  exact
                  path={routes.eventsCalendar}
                  render={() => <Navigation>Events Calendar</Navigation>}
                />

                <PrivateRoute
                  render={() => (
                    <Navigation>
                      <EmptyState message="Page Not Found" />
                    </Navigation>
                  )}
                />
              </Switch>
            </Suspense>
          </CustomBrowserRouter>
        </AppProvider>
      </ErrorBoundary>
    </ThemeProvider>
  )
}
