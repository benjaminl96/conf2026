import { useCallback, useState } from 'react';
import { CSRFToken } from '@splunk/splunk-utils/config';
import { createRESTURL } from '@splunk/splunk-utils/url';

export default function useSplunkAPI() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendRequest = useCallback(async (endpoint, app, method = 'GET', contentType, body) => {
    setIsLoading(true);
    setError(null);
    try {
      const [path, query = ''] = endpoint.split('?');
      const url = `${createRESTURL(path, app ? { app, sharing: 'app' } : {})}?output_mode=json${query ? `&${query}` : ''}`;
      const response = await fetch(url, {
        method,
        body: method === 'GET' ? null : body,
        headers: {
          'X-Splunk-Form-Key': CSRFToken,
          'X-Requested-With': 'XMLHttpRequest',
          'Content-Type': contentType,
        },
      });
      const responseData = response.headers.get('Content-Type')?.includes('application/json')
        ? await response.json()
        : await response.text();
      if (!response.ok) {
        const message = responseData?.messages?.[0]?.text || response.statusText;
        throw new Error(message || `Splunk request failed with status ${response.status}`);
      }
      console.log('[useSplunkAPI]', method, endpoint, responseData);
      return responseData;
    } catch (requestError) {
      console.error('[useSplunkAPI]', method, endpoint, requestError);
      setError(requestError);
      throw requestError;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { error, isLoading, sendRequest };
}
