import { useEffect } from 'react';
import { ServerStatus } from 'types';
import { SERVER } from 'util';

export function useRestart() {
  useEffect(() => {
    let serverTime: number;

    // Check server status every 15 seconds. Restart if server time changes
    const statusInterval = setInterval(async () => {
      try {
        const url = `${SERVER}/status?cache=${Date.now()}`;
        const data: ServerStatus = await (await fetch(url)).json();
        if (!serverTime) serverTime = data.serverTime;
        if (serverTime !== data.serverTime) window.location.reload();
      } catch (err) {
        console.error('Error fetching server status:', err);
      }
    }, 15 * 1000);

    return () => {
      clearInterval(statusInterval);
    };
  }, []);
}
