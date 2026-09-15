import { useCallback, useRef } from 'react';

export default function useSearchJob() {
  const cache = useRef(new Map());
  const searchJob = useCallback(async ({ id = 'dashboard', data, transform }) => {
    const key = `${id}:${data.length}`;
    if (!cache.current.has(key)) {
      console.log('[useSearchJob] run', { id, cacheKey: key });
      cache.current.set(key, transform ? transform(data) : data);
    } else console.log('[useSearchJob] cache hit', { id, cacheKey: key });
    return cache.current.get(key);
  }, []);
  return { searchJob };
}
