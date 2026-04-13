'use client';

import { useEffect, useRef, useCallback } from 'react';
import { useStore } from '@/lib/store';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

/**
 * Hook to subscribe to Server-Sent Events for real-time job updates
 */
export function useSSE(onEvent?: (event: any) => void) {
  const eventSourceRef = useRef<EventSource | null>(null);
  const { token, updateJob, removeJob } = useStore();

  useEffect(() => {
    if (!token) return;

    const url = `${API_BASE}/api/jobs/stream/events`;
    const eventSource = new EventSource(url, {
      // Note: EventSource doesn't support custom headers natively.
      // We'll need to pass the token via query param or use a polyfill in production.
      // For MVP, the SSE endpoint uses the auth middleware which reads from the query.
    } as any);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.type === 'job-update') {
          if (data.status === 'done' || data.status === 'failed') {
            removeJob(data.jobId);
          } else {
            updateJob(data.jobId, data);
          }
        }

        onEvent?.(data);
      } catch {
        // Ignore parse errors (heartbeats, etc.)
      }
    };

    eventSource.onerror = () => {
      // Auto-reconnect is handled by the browser
      console.warn('[SSE] Connection error — will auto-reconnect');
    };

    eventSourceRef.current = eventSource;

    return () => {
      eventSource.close();
    };
  }, [token]);

  return eventSourceRef;
}

/**
 * Hook for polling job status (fallback for SSE)
 */
export function useJobPoller(jobId: string | null, onComplete?: (job: any) => void) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!jobId) return;

    const poll = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/jobs/${jobId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('talentscore_token')}`,
          },
        });
        const { job } = await res.json();

        if (job.status === 'done' || job.status === 'failed') {
          if (intervalRef.current) clearInterval(intervalRef.current);
          onComplete?.(job);
        }
      } catch {
        // retry on next interval
      }
    };

    intervalRef.current = setInterval(poll, 2000);
    poll(); // immediate first check

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [jobId]);
}
