import { useCallback, useEffect, useState } from 'react';

export default function useKVStore(collection, seed) {
  const storageKey = `conf2026:${collection}`;
  const [data, setData] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(storageKey)) || seed;
    } catch {
      return seed;
    }
  });
  useEffect(() => localStorage.setItem(storageKey, JSON.stringify(data)), [data, storageKey]);
  const save = useCallback(
    (records) => {
      console.log('[useKVStore] save', { collection, count: records.length });
      setData(records);
    },
    [collection]
  );
  return { data, save, isLoading: false, error: null };
}
