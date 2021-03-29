import _find from 'lodash/find';
import { Route } from 'constants/routes';

export const getTopLevelRoute = (navItems: Route[], pathname?: string) => {
  if (!pathname) return null;

  const topLevelPath = '/' + pathname.split('/')[1];

  return (
    _find(
      navItems,
      (item) => item.route.toLowerCase() === topLevelPath.toLowerCase()
    ) ??
    _find(
      navItems,
      (item) => item.route.toLowerCase() === pathname.toLowerCase()
    )
  );
};

export const getRoute = (navItems: Route[], pathname?: string) => {
  if (!pathname) return null;

  const topLevelRoute = getTopLevelRoute(navItems, pathname);
  if (!topLevelRoute) return null;
  if (topLevelRoute.route === pathname) return topLevelRoute;

  return _find(
    topLevelRoute.children,
    (child) => child.route.toLowerCase() === pathname.toLowerCase()
  );
};

export const getRouteLabel = (navItems: Route[], pathname?: string) => {
  if (!pathname) return '';

  const topLevelRoute = getTopLevelRoute(navItems, pathname);
  if (!topLevelRoute) return '';
  if (topLevelRoute.route === pathname) return topLevelRoute.label;

  const childLabel = _find(
    topLevelRoute.children,
    (child) => child.route.toLowerCase() === pathname.toLowerCase()
  )?.label;
  return topLevelRoute.label + ' – ' + childLabel;
};
