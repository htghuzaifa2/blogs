
'use client';

/**
 * ---------------------------------------------------------------------------
 *                          Smart Prefetcher
 * ---------------------------------------------------------------------------
 * A resource-aware preloader that prefetches same-origin navigational
 * links to make page transitions feel faster, while respecting user's
 * data and device resources.
 *
 * HOW IT WORKS:
 * 1.  Idle Time Utilization: Uses `requestIdleCallback` to ensure prefetching
 *     only occurs when the browser's main thread is free.
 * 2.  Respects User Settings: Checks for `navigator.connection.saveData`
 *     and disables prefetching if Data Saver mode is enabled.
 * 3.  Adaptive Concurrency: Limits parallel fetches based on the user's
 *     effective connection type (2G, 3G, 4G).
 * 4.  Efficient Discovery: Uses `IntersectionObserver` with a modest `rootMargin`
 *     to prefetch links that are likely to be clicked soon.
 * 5.  Dynamic Observation: A `MutationObserver` watches for new links added
 *     to the DOM and adds them to the observation list.
 * 6.  Duplicate Prevention: A `Set` tracks URLs that have been queued to
 *     prevent redundant network requests.
 * 7.  Debuggability: Exposes a global `window.__prefetchStats` object to
 *     monitor prefetching activity.
 *
 * This module is self-initializing. Just import it once in your app.
 * import '@/lib/prefetcher';
 */

// --- State and Debugging ---
const stats = {
  total: 0,
  queued: 0,
  completed: 0,
};

if (typeof window !== 'undefined') {
  (window as any).__prefetchStats = stats;
}

// --- Configuration ---
const IO_ROOT_MARGIN = '50%';
const CONCURRENCY_LIMITS = {
  'slow-2g': 2,
  '2g': 2,
  '3g': 4,
  '4g': 6,
};
type ConnectionType = keyof typeof CONCURRENCY_LIMITS;

// --- FIFO Queue and State ---
const queue: string[] = [];
const prefetchedUrls = new Set<string>();
let activeFetches = 0;

// --- Core Logic ---

function getConcurrencyLimit(): number {
  const connection = (navigator as any).connection;
  if (connection?.saveData) {
    return 0; // Respect Data Saver mode
  }
  const effectiveType = (connection?.effectiveType as ConnectionType) || '4g';
  return CONCURRENCY_LIMITS[effectiveType] ?? CONCURRENCY_LIMITS['4g'];
}

function processQueue() {
  const limit = getConcurrencyLimit();
  while (activeFetches < limit && queue.length > 0) {
    const url = queue.shift();
    if (!url) continue;

    activeFetches++;
    stats.queued = queue.length;
    stats.completed++;

    fetch(url, { priority: 'low' as RequestPriority })
      .catch(() => {}) // Ignore fetch errors
      .finally(() => {
        activeFetches--;
        // Check if we can process more from the queue
        if (queue.length > 0) {
            requestIdleCallback(processQueue);
        }
      });
  }
}

function enqueue(url: string) {
  if (prefetchedUrls.has(url)) {
    return;
  }
  prefetchedUrls.add(url);
  queue.push(url);
  stats.total++;
  stats.queued = queue.length;
  requestIdleCallback(processQueue);
}

function isRoutable(link: HTMLAnchorElement): boolean {
    const isSameOrigin = link.origin === location.origin;
    const isHttp = link.protocol.startsWith('http');
    const isNotSpecial = !['#', 'mailto:', 'tel:'].some(p => link.href.startsWith(p));
    // Check for file extensions, but allow .html (or no extension)
    const hasNoDisallowedExtension = !/\.(?!html$)[a-z0-9]{1,4}$/i.test(link.pathname);
    const isNotDownload = link.hasAttribute('download');
    
    return isSameOrigin && isHttp && isNotSpecial && hasNoDisallowedExtension && !isNotDownload;
}

// --- Observers and Initialization ---

const intersectionObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && entry.target instanceof HTMLAnchorElement) {
        enqueue(entry.target.href);
      }
    });
  },
  { rootMargin: IO_ROOT_MARGIN }
);

function observeLink(link: HTMLAnchorElement) {
    if (isRoutable(link) && !prefetchedUrls.has(link.href)) {
        intersectionObserver.observe(link);
    }
}

const mutationObserver = new MutationObserver(mutations => {
  for (const mutation of mutations) {
    if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
            const el = node as Element;
            if (el.matches('a[href]')) {
                observeLink(el as HTMLAnchorElement);
            }
            el.querySelectorAll<HTMLAnchorElement>('a[href]').forEach(observeLink);
        }
      });
    }
  }
});

function initialize() {
  if (typeof window === 'undefined' || (window as any).__smartPrefetcherInitialized) {
    return;
  }
  (window as any).__smartPrefetcherInitialized = true;

  // Initial scan for links already on the page
  document.querySelectorAll<HTMLAnchorElement>('a[href]').forEach(observeLink);

  // Start observing the DOM for new links
  mutationObserver.observe(document.body, { childList: true, subtree: true });

  // Re-scan on SPA navigation
  const originalPushState = history.pushState;
  history.pushState = function(...args) {
    originalPushState.apply(this, args);
    requestIdleCallback(() => document.querySelectorAll<HTMLAnchorElement>('a[href]').forEach(observeLink));
  };
    const originalReplaceState = history.replaceState;
    history.replaceState = function(...args) {
    originalReplaceState.apply(this, args);
    requestIdleCallback(() => document.querySelectorAll<HTMLAnchorElement>('a[href]').forEach(observeLink));
  };
}

// Automatically initialize when the document is ready
if (document.readyState === 'complete') {
  initialize();
} else {
  window.addEventListener('DOMContentLoaded', initialize);
}

export {};
