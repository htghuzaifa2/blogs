
'use client';

type PrefetchStats = {
  total: number;
  queued: number;
  prefetched: number;
};

// --- Configuration ---
const THROTTLE_MS = 500;
const IO_ROOT_MARGIN = '50%';
const CONCURRENCY_MAP = {
  'slow-2g': 2,
  '2g': 2,
  '3g': 4,
  '4g': 6,
};
type EffectiveConnectionType = keyof typeof CONCURRENCY_MAP;

// --- State ---
const prefetched = new Set<string>();
const queue: string[] = [];
let activeFetches = 0;
let lastScan = 0;
let throttleTimer: number;

const stats: PrefetchStats = {
  total: 0,
  queued: 0,
  prefetched: 0,
};

// Expose stats to the window for debugging
if (typeof window !== 'undefined') {
  (window as any).__prefetchStats = stats;
}

// --- Observers and Handlers ---
let intersectionObserver: IntersectionObserver;

function getConcurrencyLimit(): number {
  const connection = (navigator as any).connection;
  if (connection?.saveData) {
    return 0; // Respect Save-Data header
  }
  const type = connection?.effectiveType as EffectiveConnectionType;
  return CONCURRENCY_MAP[type] || CONCURRENCY_MAP['4g'];
}

function processQueue() {
  if (activeFetches >= getConcurrencyLimit() || queue.length === 0) {
    return;
  }

  const url = queue.shift();
  if (!url) return;
  stats.queued = queue.length;

  activeFetches++;
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.href = url;
  link.as = 'document';

  link.onload = link.onerror = () => {
    activeFetches--;
    link.remove();
    processQueue();
  };

  document.head.appendChild(link);
}

function queuePrefetch(url: string) {
  if (prefetched.has(url) || queue.includes(url)) {
    return;
  }
  prefetched.add(url);
  queue.push(url);
  stats.queued = queue.length;
  stats.total++;
  
  requestIdleCallback(processQueue, { timeout: 2000 });
}

function handleIntersection(entries: IntersectionObserverEntry[]) {
  entries.forEach(entry => {
    if (entry.isIntersecting && entry.target instanceof HTMLAnchorElement) {
      queuePrefetch(entry.target.href);
      intersectionObserver.unobserve(entry.target);
    }
  });
}

function isRoutable(link: HTMLAnchorElement): boolean {
  // Check if the link is an HTML document on the same origin
  const isSameOrigin = link.origin === location.origin;
  const isHttp = link.protocol.startsWith('http');
  const isNotSpecial = !['#', 'mailto:', 'tel:'].some(p => link.href.startsWith(p));
  const isNotFile = !link.pathname.includes('.') || link.pathname.endsWith('.html');
  const isNotDownload = link.hasAttribute('download');

  return isSameOrigin && isHttp && isNotSpecial && isNotFile && !isNotDownload;
}

function scanAndObserve() {
  const now = Date.now();
  if (now - lastScan < THROTTLE_MS) {
    clearTimeout(throttleTimer);
    throttleTimer = setTimeout(scanAndObserve, THROTTLE_MS);
    return;
  }
  lastScan = now;

  document.querySelectorAll<HTMLAnchorElement>('a[href]').forEach(link => {
    if (isRoutable(link) && !prefetched.has(link.href)) {
      intersectionObserver.observe(link);
    }
  });
}

function initialize() {
  if (typeof window === 'undefined' || (window as any).__prefetcherInitialized) {
    return;
  }
  (window as any).__prefetcherInitialized = true;

  intersectionObserver = new IntersectionObserver(handleIntersection, {
    rootMargin: IO_ROOT_MARGIN,
  });

  // --- Event Listeners ---
  document.addEventListener('DOMContentLoaded', scanAndObserve);
  window.addEventListener('load', scanAndObserve); // For scripts that run after DOMContentLoaded

  // Observe for dynamically added links
  const mutationObserver = new MutationObserver(scanAndObserve);
  mutationObserver.observe(document.body, { childList: true, subtree: true });

  // Handle SPA navigation
  const originalPushState = history.pushState;
  const originalReplaceState = history.replaceState;

  history.pushState = function(...args) {
    originalPushState.apply(this, args);
    scanAndObserve();
  };

  history.replaceState = function(...args) {
    originalReplaceState.apply(this, args);
    scanAndObserve();
  };
  
  // Initial scan
  requestIdleCallback(scanAndObserve, { timeout: 1000 });
}

// Automatically initialize
initialize();

// This file is a module, but we don't need to export anything.
// Its side-effect of initializing the prefetcher is all that's needed.
export {};
