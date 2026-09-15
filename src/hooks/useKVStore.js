import { useCallback } from 'react';
import useSplunkAPI from './useSplunkAPI';

export default function useKVStore(app = 'conf2026') {
  const { error, isLoading, sendRequest } = useSplunkAPI();
  const getCollection = useCallback(
    (collection) => sendRequest(`storage/collections/data/${collection}`, app, 'GET', 'application/json'),
    [app, sendRequest]
  );
  const editCollectionEntry = useCallback(
    (collection, key, values) =>
      sendRequest(
        `storage/collections/data/${collection}/${encodeURIComponent(key)}`,
        app,
        'POST',
        'application/json',
        JSON.stringify(values)
      ),
    [app, sendRequest]
  );
  const postCollectionEntries = useCallback(
    (collection, values) =>
      sendRequest(
        `storage/collections/data/${collection}/batch_save`,
        app,
        'POST',
        'application/json',
        JSON.stringify(values)
      ),
    [app, sendRequest]
  );
  return { error, isLoading, getCollection, editCollectionEntry, postCollectionEntries };
}
