
'use client';

/**
 * ---------------------------------------------------------------------------
 *                              Prefetch Extreme
 * ---------------------------------------------------------------------------
 * A zero-latency preloader that aggressively fetches same-origin navigational
 * links to make page transitions feel instantaneous. It prioritizes speed
 * over resource conservation.
 *
 * HOW IT WORKS:
 * 1.  Aggressive Discovery: A MutationObserver instantly detects any links
 *     added to the DOM and adds them to a queue.
 * 2.  Wide Viewport Scanning: An IntersectionObserver with a large root margin
 *     (200%) pre-emptively fetches links that are far outside the viewport.
 * 3.  Instant Fetching: The queue is processed immediately without waiting for
 *     browser idle time. It uses a high concurrency limit.
 * 4.  Cache Warming: After a page is prefetched, it's loaded into a hidden
 *     iframe for a short period. This forces the browser to parse the HTML and
 *     fetch critical subresources (CSS, JS), warming up the disk and memory cache.
 * 5.  Efficient URL Tracking: A Bloom filter is used to track prefetched URLs
 *     with minimal memory overhead and O(1) lookup time.
 *
 * This module is self-initializing. Just import it once in your app.
 * import '@/lib/prefetcher';
 */

// --- State and Debugging ---
const stats = {
  queued: 0,
  fetched: 0,
  cacheHits: 0,
};

if (typeof window !== 'undefined') {
  (window as any).__prefetchExtreme = stats;
}

// --- Configuration ---
const CONCURRENCY_LIMIT_DEFAULT = 20;
const CONCURRENCY_LIMIT_SAVER = 6;
const IFRAME_WARMUP_DURATION = 30000; // 30 seconds
const IO_ROOT_MARGIN = '200%';

// --- FIFO Queue ---
const queue: string[] = [];
let activeFetches = 0;

// --- Bloom Filter for URL tracking ---
const bloomFilter = new Uint8Array(1024); // 1KB
const hashFunctions = [(s: string) => djb2(s) % 8192, (s: string) => sdbm(s) % 8192];

function djb2(str: string): number {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 33) ^ str.charCodeAt(i);
  }
  return hash >>> 0;
}

function sdbm(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + (hash << 6) + (hash << 16) - hash;
  }
  return hash >>> 0;
}

function bloomAdd(url: string) {
  for (const hash of hashFunctions) {
    const index = hash(url);
    bloomFilter[Math.floor(index / 8)] |= 1 << (index % 8);
  }
}

function bloomHas(url: string): boolean {
  for (const hash of hashFunctions) {
    const index = hash(url);
    if ((bloomFilter[Math.floor(index / 8)] & (1 << (index % 8))) === 0) {
      return false;
    }
  }
  return true;
}

// --- Core Logic ---

function getConcurrencyLimit(): number {
  const connection = (navigator as any).connection;
  return connection?.saveData ? CONCURRENCY_LIMIT_SAVER : CONCURRENCY_LIMIT_DEFAULT;
}

function warmUpCache(url: string) {
  const iframe = document.createElement('iframe');
  iframe.src = url;
  iframe.style.display = 'none';
  document.body.appendChild(iframe);

  setTimeout(() => {
    iframe.remove();
  }, IFRAME_WARMUP_DURATION);
}

function processQueue() {
  const limit = getConcurrencyLimit();
  while (activeFetches < limit && queue.length > 0) {
    const url = queue.shift();
    if (!url) continue;

    stats.queued = queue.length;
    activeFetches++;
    stats.fetched++;

    fetch(url, { priority: 'low' as RequestPriority })
      .then(res => {
        if (res.ok && res.headers.get('Content-Type')?.includes('text/html')) {
          warmUpCache(url);
          stats.cacheHits++;
        }
      })
      .catch(() => {}) // Ignore fetch errors (e.g., network issues)
      .finally(() => {
        activeFetches--;
        // Check if we can process more from the queue
        if (queue.length > 0) {
          processQueue();
        }
      });
  }
}

function enqueue(url: string) {
  if (bloomHas(url)) {
    return;
  }
  bloomAdd(url);
  queue.push(url);
  stats.queued = queue.length;
  processQueue(); // Consume immediately
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

function scanAndObserve() {
    // Prefetch all visible links immediately
    const visibleLinks = document.querySelectorAll<HTMLAnchorElement>('a[href]');
    visibleLinks.forEach(link => {
        if (isRoutable(link)) {
            const rect = link.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                 enqueue(link.href);
            } else {
                 // If not visible, let the IO handle it
                 if (!bloomHas(link.href)) {
                     intersectionObserver.observe(link);
                 }
            }
        }
    });
}


const mutationObserver = new MutationObserver(mutations => {
  for (const mutation of mutations) {
    if (mutation.type === 'childList') {
        mutation.addedNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
            const el = node as Element;
            // If the added node is a link
            if (el.matches('a[href]')) {
                if (isRoutable(el as HTMLAnchorElement)) {
                    intersectionObserver.observe(el as HTMLAnchorElement);
                }
            }
            // Or if it contains links
            el.querySelectorAll<HTMLAnchorElement>('a[href]').forEach(link => {
                if (isRoutable(link)) {
                    intersectionObserver.observe(link);
                }
            });
        }
      });
    }
  }
});


function initialize() {
  if (typeof window === 'undefined' || (window as any).__prefetcherExtremeInitialized) {
    return;
  }
  (window as any).__prefetcherExtremeInitialized = true;
  
  // Start observing the DOM for changes.
  mutationObserver.observe(document.body, { childList: true, subtree: true });

  // Initial scan of the document
  if (document.readyState === 'complete') {
    scanAndObserve();
  } else {
    window.addEventListener('load', scanAndObserve);
  }
}

// Automatically initialize
initialize();

export {};
