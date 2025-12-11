import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { startRouteTimer } from '@/utils/perfRoute';

export default function RoutePerfListener() {
  const location = useLocation();
  const prev = useRef(location.pathname);

  useEffect(() => {
    // start timer when location changes
    const name = location.pathname || 'route';
    startRouteTimer(name);
    prev.current = location.pathname;
    // no cleanup needed here; end will be triggered by page components
  }, [location.pathname]);

  return null;
}
