import { useCallback, useState } from 'react';

export default function useLog() {
  const [events, setEvents] = useState([]);
  const log = useCallback((message, details = {}) => {
    console.log('[useLog]', message, details);
    setEvents((current) => [{ id: crypto.randomUUID(), message, details, time: new Date() }, ...current].slice(0, 5));
  }, []);
  return { events, log };
}
