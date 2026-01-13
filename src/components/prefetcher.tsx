
'use client';

import { useEffect } from 'react';

export function Prefetcher() {
  useEffect(() => {
    // This component's only purpose is to ensure the prefetcher module
    // is imported and executed on the client-side.
    import('@/lib/prefetcher');
  }, []);

  return null;
}
