import { useCallback } from 'react';
import useSearchJob from './useSearchJob';

export default function useLog() {
  const { searchJob } = useSearchJob();

  const log = useCallback(
    async ({ action, message, details = {}, index = 'main', sourcetype, source }) => {
      const event = JSON.stringify({ action, message, details });
      const escapedEvent = event.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
      console.log('[useLog] write', { action, message, details, index, sourcetype, source });
      const { sid, content } = await searchJob({
        search: `| makeresults | eval _raw="${escapedEvent}" | collect index=${index} sourcetype="${sourcetype}" source="${source}"`,
      });
      return { sid, content };
    },
    [searchJob]
  );

  return { log };
}
