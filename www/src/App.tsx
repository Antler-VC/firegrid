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

import SignOutPage from './pages/AuthPages/SignOutPage'
import ForgotPasswordPage from 'pages/AuthPages/ForgotPasswordPage'
import ResetPasswordPage from 'pages/AuthPages/ResetPasswordPage'
import AuthLinkPage from 'pages/AuthPages/AuthLinkPage'
import GoogleAuthPage from 'pages/AuthPages/GoogleAuthPage'
import SignInPage from 'pages/AuthPages/SignInPage'
import SignUpPage from 'pages/AuthPages/SignUpPage'

const AuthTokenPage = lazy(
  () =>
    import(
      /* webpackPrefetch: true */
      /* webpackChunkName: "TokenPage" */
      './pages/AuthPages/AuthTokenPage'
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
                  render={() => <AuthTokenPage />}
                />
                <Route
                  exact
                  path={routes.authLink}
                  render={() => <AuthLinkPage />}
                />
                <Route
                  exact
                  path={routes.googleAuth}
                  render={() => <GoogleAuthPage />}
                />
                <Route
                  exact
                  path={routes.forgotPassword}
                  render={() => <ForgotPasswordPage />}
                />
                <Route
                  exact
                  path={routes.resetPassword}
                  render={() => <ResetPasswordPage />}
                />
                <Route
                  exact
                  path={routes.signIn}
                  render={() => <SignInPage passwordAuth />}
                />
                <Route
                  exact
                  path={routes.signUp}
                  render={() => <SignUpPage passwordAuth />}
                />

                <Route
                  exact
                  path={routes.signOut}
                  render={() => <SignOutPage />}
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
