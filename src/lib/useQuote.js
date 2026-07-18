import { useEffect, useSyncExternalStore } from 'react';
import { subscribeQuotes, getQuotesVersion, fetchQuote } from './market';

// Kicks off (throttled, cached) live fetches for the given tickers and
// re-renders the caller whenever any tracked quote updates. Returns the
// current quote-cache version so it can be dropped into a useMemo's deps.
export function useLiveQuotes(tickers) {
  const version = useSyncExternalStore(subscribeQuotes, getQuotesVersion);
  const key = tickers.filter(Boolean).join(',');

  useEffect(() => {
    key.split(',').filter(Boolean).forEach(t => fetchQuote(t));
  }, [key]);

  return version;
}
