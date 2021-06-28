import { Suspense } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';

import {
  CssBaseline,
  MuiThemeProvider as ThemeProvider,
} from '@material-ui/core';
import Theme from './Theme';

import { AppProvider } from 'contexts/AppContext';
import { FiregridProvider } from 'contexts/FiregridContext';
import { ListEditorProvider } from 'contexts/ListEditorContext';
import CustomBrowserRouter from './utils/CustomBrowserRouter';
import SegmentPageTracker from 'utils/SegmentPageTracker';
import PrivateRoute from './utils/PrivateRoute';
import { SnackProvider } from 'samosas';

import GlobalStyles from './utils/GlobalStyles';
import { routes } from './constants/routes';

import {
  ErrorBoundary,
  Loading,
  EmptyState,
} from '@antlerengineering/components';
import Navigation from './components/Navigation';

import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import SignOutPage from './pages/AuthPages/SignOutPage';
import ForgotPasswordPage from 'pages/AuthPages/ForgotPasswordPage';
import AdminAuthPage from 'pages/AuthPages/AdminAuthPage';
import AuthLinkPage from 'pages/AuthPages/AuthLinkPage';
import GoogleAuthPage from 'pages/AuthPages/GoogleAuthPage';
import SignInPage from 'pages/AuthPages/SignInPage';

import FieldEditorPage from 'pages/FieldEditorPage';
import ListEditorPage from 'pages/ListEditorPage';

export default function App() {
  return (
    <ThemeProvider theme={Theme}>
      <CssBaseline />
      <GlobalStyles />
      <ErrorBoundary>
        <AppProvider>
          <SnackProvider>
            <DndProvider backend={HTML5Backend} context={window}>
              <CustomBrowserRouter>
                <SegmentPageTracker />
                <Suspense fallback={<Loading fullScreen />}>
                  <Switch>
                    <Route
                      exact
                      path={routes.adminAuth}
                      render={() => <AdminAuthPage />}
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
                      path={routes.signIn}
                      render={() => <SignInPage googleAuth />}
                    />

                    <Route
                      exact
                      path={routes.signOut}
                      render={() => <SignOutPage />}
                    />

                    <PrivateRoute
                      exact
                      path={routes.home}
                      render={() => <Redirect to={routes.fieldEditor} />}
                    />

                    <PrivateRoute
                      exact
                      path={[routes.fieldEditor, routes.fieldEditor + '/:id']}
                      render={(props) => (
                        <Navigation>
                          <FiregridProvider {...props}>
                            <FieldEditorPage />
                          </FiregridProvider>
                        </Navigation>
                      )}
                    />

                    <PrivateRoute
                      exact
                      path={[routes.listEditor, routes.listEditor + '/:id']}
                      render={(props) => (
                        <Navigation>
                          <ListEditorProvider {...props}>
                            <ListEditorPage />
                          </ListEditorProvider>
                        </Navigation>
                      )}
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
            </DndProvider>
          </SnackProvider>
        </AppProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
}
