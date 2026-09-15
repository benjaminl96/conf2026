import { useCallback } from 'react';
import useSplunkAPI from './useSplunkAPI';

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

export default function useSearchJob() {
  const { sendRequest } = useSplunkAPI();
  const searchJob = useCallback(
    async ({ search, earliest_time = '-24h', latest_time = 'now', count = 0 }) => {
      console.log('[useSearchJob] dispatch', search);
      const body = new URLSearchParams({ search, earliest_time, latest_time, output_mode: 'json' });
      const created = await sendRequest('search/jobs', null, 'POST', 'application/x-www-form-urlencoded', body);
      const sid = created.sid;
      if (!sid) throw new Error('Splunk did not return a search job SID.');
      let content;
      for (;;) {
        const status = await sendRequest(
          `search/jobs/${encodeURIComponent(sid)}`,
          null,
          'GET',
          'application/x-www-form-urlencoded'
        );
        content = status.entry?.[0]?.content;
        console.log('[useSearchJob] status', { sid, dispatchState: content?.dispatchState });
        if (content?.isFailed) throw new Error(`Search job ${sid} failed.`);
        if (content?.isDone) break;
        await wait(250);
      }
      const payload = await sendRequest(
        `search/jobs/${encodeURIComponent(sid)}/results?count=${count}`,
        null,
        'GET',
        'application/x-www-form-urlencoded'
      );
      console.log('[useSearchJob] results', { sid, count: payload.results?.length || 0 });
      return { sid, content, results: payload.results || [], fields: payload.fields || [] };
    },
    [sendRequest]
  );
  return { searchJob };
}
