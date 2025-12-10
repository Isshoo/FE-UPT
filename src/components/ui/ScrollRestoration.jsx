'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * ScrollRestoration Component
 *
 * Automatically scrolls to the top of the page whenever the route changes.
 * This solves the issue where navigating between pages preserves the scroll position,
 * causing the new page to appear scrolled down.
 */
export default function ScrollRestoration() {
  const pathname = usePathname();

  useEffect(() => {
    // Scroll to top whenever the pathname changes
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant', // Use 'instant' for immediate scroll, 'smooth' for animated
    });
  }, [pathname]);

  return null; // This component doesn't render anything
}
