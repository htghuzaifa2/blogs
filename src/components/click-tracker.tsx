
'use client';

import { useEffect, useRef } from 'react';

const CLICK_COUNT_KEY = 'huzi-blog-click-count';
const REDIRECT_COUNT_KEY = 'huzi-blog-redirect-count';
const CLICK_THRESHOLD = 39;
const REDIRECT_LIMIT = 3;

export function ClickTracker({ children }: { children: React.ReactNode }) {
  const clickCount = useRef(0);
  const redirectCount = useRef(0);

  useEffect(() => {
    // Load counts from localStorage on component mount
    const storedClickCount = localStorage.getItem(CLICK_COUNT_KEY);
    const storedRedirectCount = localStorage.getItem(REDIRECT_COUNT_KEY);

    clickCount.current = storedClickCount ? parseInt(storedClickCount, 10) : 0;
    redirectCount.current = storedRedirectCount ? parseInt(storedRedirectCount, 10) : 0;
    
    const handleClick = () => {
      // Only track clicks if the redirect limit has not been reached
      if (redirectCount.current >= REDIRECT_LIMIT) {
        return;
      }

      clickCount.current += 1;
      localStorage.setItem(CLICK_COUNT_KEY, clickCount.current.toString());

      if (clickCount.current >= CLICK_THRESHOLD) {
        // Open the URL in a new tab
        window.open('https://huzi.pk', '_blank');

        // Increment redirect count and save it
        redirectCount.current += 1;
        localStorage.setItem(REDIRECT_COUNT_KEY, redirectCount.current.toString());

        // Reset click count
        clickCount.current = 0;
        localStorage.setItem(CLICK_COUNT_KEY, '0');
      }
    };

    // Add event listener to the whole document
    document.addEventListener('click', handleClick);

    // Cleanup the event listener when the component unmounts
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return <>{children}</>;
}
