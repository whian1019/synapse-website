import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Handles scroll position on route change:
 * - navigating to a path with a hash scrolls to that section
 * - navigating to a plain path scrolls to the top
 */
export default function ScrollManager() {
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      // wait a tick for the target route's content to mount
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    } else {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [location.pathname, location.hash]);

  return null;
}
