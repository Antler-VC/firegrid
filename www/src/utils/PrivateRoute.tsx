import { Route, RouteProps, Redirect } from 'react-router-dom';

import { useAppContext } from 'contexts/AppContext';
import { Loading } from '@antlerengineering/components';
interface IPrivateRouteProps extends RouteProps {
  render: NonNullable<RouteProps['render']>;
}

export default function PrivateRoute({ render, ...rest }: IPrivateRouteProps) {
  const { currentUser } = useAppContext();

  if (!!currentUser) return <Route {...rest} render={render} />;

  if (currentUser === null)
    return (
      <Redirect
        to={
          '/auth?redirect=' + encodeURIComponent(rest.location?.pathname ?? '')
        }
      />
    );

  return (
    <Route
      {...rest}
      render={() => <Loading message="Authenticating" fullScreen />}
    />
  );
}
