import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { useAppContext } from 'contexts/AppContext';
import { getRouteLabel } from './routes';

export default function SegmentPageTracker() {
  const history = useHistory();
  const { navItems } = useAppContext();

  const trackPage = (pathname: string) => {
    if (navItems.length === 0) return;
    window.analytics?.page(getRouteLabel(navItems, pathname), {
      path: pathname,
    });
  };

  useEffect(() => {
    trackPage(history.location.pathname);
    return history.listen((location) => trackPage(location.pathname));
  }, [history]);

  return null;
}
